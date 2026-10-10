import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { z } from 'zod';
import { ZodPipe } from '../common/zod.pipe.js';
import { ClientInfo, CurrentUser, Public } from './auth.decorators.js';
import type { AuthUser } from './auth.decorators.js';
import { AuthService } from './auth.service.js';
import type { ClientCtx } from './auth.service.js';

const password = z
  .string()
  .min(10, 'At least 10 characters')
  .max(128)
  .regex(/[a-z]/, 'Needs a lowercase letter')
  .regex(/[A-Z]/, 'Needs an uppercase letter')
  .regex(/[0-9]/, 'Needs a number');

const registerSchema = z.object({
  email: z.email().max(254),
  password,
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  phone: z.string().trim().max(30).optional(),
});
const loginSchema = z.object({ email: z.email(), password: z.string().min(1).max(128) });
const googleAuthSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().optional(),
  googleId: z.string().optional(),
});
const refreshSchema = z.object({ refreshToken: z.string().min(10).max(300) });
const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password });

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  register(@Body(new ZodPipe(registerSchema)) body: z.infer<typeof registerSchema>, @ClientInfo() ctx: ClientCtx) {
    return this.auth.register(body, ctx);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post('login')
  login(@Body(new ZodPipe(loginSchema)) body: z.infer<typeof loginSchema>, @ClientInfo() ctx: ClientCtx) {
    return this.auth.login(body.email, body.password, ctx);
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @HttpCode(200)
  @Post('google')
  continueWithGoogle(
    @Body(new ZodPipe(googleAuthSchema)) body: z.infer<typeof googleAuthSchema>,
    @ClientInfo() ctx: ClientCtx,
  ) {
    return this.auth.continueWithGoogle(body, ctx);
  }

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @HttpCode(200)
  @Post('refresh')
  refresh(@Body(new ZodPipe(refreshSchema)) body: z.infer<typeof refreshSchema>, @ClientInfo() ctx: ClientCtx) {
    return this.auth.refresh(body.refreshToken, ctx);
  }

  @Public()
  @HttpCode(200)
  @Post('logout')
  logout(@Body(new ZodPipe(refreshSchema)) body: z.infer<typeof refreshSchema>) {
    return this.auth.logout(body.refreshToken);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.id);
  }

  @HttpCode(200)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body(new ZodPipe(changePasswordSchema)) body: z.infer<typeof changePasswordSchema>,
    @ClientInfo() ctx: ClientCtx,
  ) {
    return this.auth.changePassword(user.id, body.currentPassword, body.newPassword, ctx);
  }
}
