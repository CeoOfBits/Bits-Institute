import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { ClientInfo, CurrentUser, Public, RequirePermissions } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { pagination, parseId, uuid } from '../common/utils.js';
import { CertificatesService } from './certificates.service.js';

const issueSchema = z.object({
  studentId: uuid,
  courseId: uuid,
  batchId: uuid.optional(),
  grade: z.string().max(20).optional(),
});

const revokeSchema = z.object({
  reason: z.string().min(3).max(300),
});

const listQuery = pagination.extend({
  search: z.string().max(100).optional(),
  courseId: uuid.optional(),
});

type Ctx = { ip?: string };

@Controller()
export class CertificatesController {
  constructor(private readonly certificates: CertificatesService) {}

  /**
   * Public verification endpoint
   */
  @Public()
  @Get('public/certificates/verify/:code')
  verify(@Param('code') code: string) {
    return this.certificates.verifyCertificate(code);
  }

  @RequirePermissions('certificate:read')
  @Get('certificates')
  list(@Query(new ZodPipe(listQuery)) q: z.infer<typeof listQuery>) {
    return this.certificates.list(q);
  }

  @RequirePermissions('certificate:issue')
  @Post('certificates')
  issue(
    @Body(new ZodPipe(issueSchema)) body: z.infer<typeof issueSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.certificates.issue(body, user.id, ctx.ip);
  }

  @RequirePermissions('certificate:revoke')
  @Patch('certificates/:id/revoke')
  revoke(
    @Param('id') id: string,
    @Body(new ZodPipe(revokeSchema)) body: z.infer<typeof revokeSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.certificates.revoke(parseId(id), body.reason, user.id, ctx.ip);
  }
}
