import { HttpException, HttpStatus, Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { PrismaService } from '../prisma/prisma.module.js';
import { AuditService } from '../audit/audit.module.js';

const MAX_FAILED = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
// Pre-computed hash so unknown-email logins cost the same as real ones (no user enumeration by timing).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

export interface ClientCtx {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  private async publicUser(id: string) {
    const u = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { roles: { include: { role: true } } },
    });
    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      avatarUrl: u.avatarUrl,
      roles: u.roles.map((r) => r.role.key),
    };
  }

  private async issueTokens(userId: string, ctx: ClientCtx, sessionId?: string) {
    const secret = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 86_400_000);

    let id = sessionId;
    if (id) {
      await this.prisma.session.update({
        where: { id },
        data: { refreshTokenHash: sha256(secret), expiresAt },
      });
    } else {
      const s = await this.prisma.session.create({
        data: {
          userId,
          refreshTokenHash: sha256(secret),
          expiresAt,
          ip: ctx.ip,
          userAgent: ctx.userAgent?.slice(0, 255),
        },
      });
      id = s.id;
    }
    const accessToken = await this.jwt.signAsync({ sub: userId, sid: id });
    return { accessToken, refreshToken: `${id}.${secret}` };
  }

  async register(
    input: { email: string; password: string; firstName: string; lastName: string; phone?: string },
    ctx: ClientCtx,
  ) {
    const email = input.email.toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException('An account with this email already exists');
    }
    const role = await this.prisma.role.findUniqueOrThrow({ where: { key: 'STUDENT' } });
    const year = new Date().getFullYear();
    const count = await this.prisma.studentProfile.count();
    const registrationNo = `BITS-${year}-${String(count + 1).padStart(5, '0')}-${randomBytes(2).toString('hex').toUpperCase()}`;

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(input.password, 12),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        status: 'ACTIVE',
        roles: { create: { roleId: role.id } },
        studentProfile: { create: { registrationNo } },
      },
    });
    await this.audit.record({ userId: user.id, action: 'auth.register', entityType: 'User', entityId: user.id, ip: ctx.ip });
    return { user: await this.publicUser(user.id), ...(await this.issueTokens(user.id, ctx)) };
  }

  async login(emailRaw: string, password: string, ctx: ClientCtx) {
    const email = emailRaw.toLowerCase();

    const failed = await this.prisma.loginActivity.count({
      where: { email, success: false, createdAt: { gte: new Date(Date.now() - LOCK_WINDOW_MS) } },
    });
    if (failed >= MAX_FAILED) {
      throw new HttpException('Too many failed attempts. Try again in 15 minutes.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    const log = (success: boolean) =>
      this.prisma.loginActivity.create({
        data: { userId: user?.id, email, success, ip: ctx.ip, userAgent: ctx.userAgent?.slice(0, 255) },
      });

    if (!user || !ok) {
      await log(false);
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status !== 'ACTIVE') {
      await log(false);
      throw new UnauthorizedException('This account is not active');
    }

    await log(true);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const publicUser = await this.publicUser(user.id);
    if (publicUser.roles.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN')) {
      await this.audit.record({ userId: user.id, action: 'auth.admin_login', entityType: 'User', entityId: user.id, ip: ctx.ip });
    }
    return { user: publicUser, ...(await this.issueTokens(user.id, ctx)) };
  }

  async refresh(refreshToken: string, ctx: ClientCtx) {
    const [sessionId, secret] = refreshToken.split('.');
    if (!sessionId || !secret) throw new UnauthorizedException('Invalid refresh token');

    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    const given = Buffer.from(sha256(secret));
    const stored = Buffer.from(session.refreshTokenHash);
    if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
      // A previously rotated token was replayed: revoke the whole session.
      await this.prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const user = await this.prisma.user.findFirst({ where: { id: session.userId, deletedAt: null, status: 'ACTIVE' } });
    if (!user) throw new UnauthorizedException('Account is not active');

    return { user: await this.publicUser(user.id), ...(await this.issueTokens(user.id, ctx, sessionId)) };
  }

  async logout(refreshToken: string) {
    const [sessionId] = refreshToken.split('.');
    if (sessionId) {
      await this.prisma.session.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    return { success: true };
  }

  async changePassword(userId: string, current: string, next: string, ctx: ClientCtx) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!(await bcrypt.compare(current, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(next, 12) } }),
      this.prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    await this.audit.record({ userId, action: 'auth.change_password', entityType: 'User', entityId: userId, ip: ctx.ip });
    return { success: true };
  }

  me(userId: string) {
    return this.publicUser(userId);
  }

  async continueWithGoogle(input: { idToken: string }, ctx: ClientCtx) {
    if (!input.idToken || typeof input.idToken !== 'string') {
      throw new UnauthorizedException('Google ID token is required');
    }

    let payload: {
      iss?: string;
      sub?: string;
      aud?: string;
      email?: string;
      email_verified?: string | boolean;
      name?: string;
      picture?: string;
      given_name?: string;
      family_name?: string;
      error?: string;
      error_description?: string;
    };

    try {
      const googleRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(input.idToken.trim())}`,
        { method: 'GET' },
      );

      if (!googleRes.ok) {
        throw new UnauthorizedException('Invalid or expired Google authentication token');
      }

      payload = (await googleRes.json()) as typeof payload;
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      throw new UnauthorizedException('Failed to communicate with Google authentication servers');
    }

    // 1. Verify Issuer
    if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
      throw new UnauthorizedException('Invalid Google token issuer');
    }

    // 2. Verify Audience if GOOGLE_CLIENT_ID is configured
    if (env.GOOGLE_CLIENT_ID && payload.aud !== env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('Google token audience does not match configured Client ID');
    }

    // 3. Verify Email and Email Verification status
    if (!payload.email) {
      throw new UnauthorizedException('Google token does not contain an email address');
    }

    const isVerified = payload.email_verified === 'true' || payload.email_verified === true;
    if (!isVerified) {
      throw new UnauthorizedException('Google email address is not verified');
    }

    const email = payload.email.toLowerCase().trim();
    const firstName = payload.given_name || payload.name?.split(' ')[0] || email.split('@')[0];
    const lastName = payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '';
    const avatarUrl = payload.picture || null;

    let user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      // Create new user with default STUDENT role only. Never grant admin or instructor automatically.
      const role = await this.prisma.role.findUniqueOrThrow({ where: { key: 'STUDENT' } });
      const year = new Date().getFullYear();
      const count = await this.prisma.studentProfile.count();
      const registrationNo = `BITS-${year}-${String(count + 1).padStart(5, '0')}-${randomBytes(2).toString('hex').toUpperCase()}`;
      const randomPass = randomBytes(32).toString('hex');

      user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash(randomPass, 12),
          firstName,
          lastName,
          avatarUrl,
          status: 'ACTIVE',
          emailVerifiedAt: new Date(),
          roles: { create: { roleId: role.id } },
          studentProfile: { create: { registrationNo } },
        },
        include: { roles: { include: { role: true } } },
      });

      await this.audit.record({
        userId: user.id,
        action: 'auth.google_register',
        entityType: 'User',
        entityId: user.id,
        ip: ctx.ip,
      });
    } else {
      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException('This account is not active or has been suspended');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatarUrl: avatarUrl || user.avatarUrl,
          emailVerifiedAt: user.emailVerifiedAt || new Date(),
        },
      });

      await this.audit.record({
        userId: user.id,
        action: 'auth.google_login',
        entityType: 'User',
        entityId: user.id,
        ip: ctx.ip,
      });
    }

    const publicUser = await this.publicUser(user.id);
    return { user: publicUser, ...(await this.issueTokens(user.id, ctx)) };
  }
}
