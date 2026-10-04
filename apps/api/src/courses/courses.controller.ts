import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { ClientInfo, CurrentUser, Public, RequirePermissions } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { pagination, parseId, uuid } from '../common/utils.js';
import { CoursesService } from './courses.service.js';

const lesson = z.object({
  title: z.string().trim().min(1).max(160),
  type: z.enum(['VIDEO', 'TEXT', 'FILE', 'QUIZ', 'ASSIGNMENT', 'LIVE']).optional(),
  content: z.string().max(50_000).optional(),
  durationMins: z.number().int().min(0).max(1000).optional(),
  isPreview: z.boolean().optional(),
});

const courseBase = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().min(2).max(80).optional(),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(20).max(20_000),
  categoryId: uuid,
  imageUrl: z.string().url().nullish(),
  durationHours: z.number().int().min(1).max(5000).nullish(),
  durationLabel: z.string().max(60).nullish(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).optional(),
  requirements: z.array(z.string().trim().min(1).max(200)).max(30).optional(),
  outcomes: z.array(z.string().trim().min(1).max(200)).max(30).optional(),
  priceMinor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  enrollmentOpen: z.boolean().optional(),
  certificateEnabled: z.boolean().optional(),
  certificateCode: z.string().trim().regex(/^[A-Z0-9]{2,12}$/).nullish(),
  defaultInstructorId: uuid.nullish(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  seoTitle: z.string().max(70).nullish(),
  seoDescription: z.string().max(170).nullish(),
  seoKeywords: z.array(z.string().max(60)).max(20).optional(),
  faqs: z.array(z.object({ question: z.string().min(3).max(300), answer: z.string().min(3).max(3000) })).max(40).optional(),
  modules: z.array(z.object({ title: z.string().trim().min(1).max(160), lessons: z.array(lesson).max(100).optional() })).max(60).optional(),
});
const createSchema = courseBase;
const updateSchema = courseBase.partial();

const publicQuery = pagination.extend({ category: z.string().optional(), search: z.string().max(80).optional() });
const adminQuery = pagination.extend({
  search: z.string().max(80).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  categoryId: uuid.optional(),
});

@Controller()
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  // ── public ──
  @Public()
  @Get('public/courses')
  listPublic(@Query(new ZodPipe(publicQuery)) q: z.infer<typeof publicQuery>) {
    return this.courses.listPublic(q);
  }

  @Public()
  @Get('public/courses/:slug')
  getPublic(@Param('slug') slug: string) {
    return this.courses.getPublic(slug);
  }

  @Public()
  @Get('public/categories')
  categories() {
    return this.courses.categories();
  }

  // ── admin ──
  @RequirePermissions('course:read')
  @Get('courses')
  listAdmin(@Query(new ZodPipe(adminQuery)) q: z.infer<typeof adminQuery>) {
    return this.courses.listAdmin(q);
  }

  @RequirePermissions('course:read')
  @Get('courses/:id')
  getAdmin(@Param('id') id: string) {
    return this.courses.getAdmin(parseId(id));
  }

  @RequirePermissions('course:create')
  @Post('courses')
  create(@Body(new ZodPipe(createSchema)) body: z.infer<typeof createSchema>, @CurrentUser() u: AuthUser, @ClientInfo() c: { ip?: string }) {
    return this.courses.create(body, u.id, c.ip);
  }

  @RequirePermissions('course:update')
  @Patch('courses/:id')
  update(@Param('id') id: string, @Body(new ZodPipe(updateSchema)) body: z.infer<typeof updateSchema>, @CurrentUser() u: AuthUser, @ClientInfo() c: { ip?: string }) {
    return this.courses.update(parseId(id), body, u.id, c.ip);
  }

  @RequirePermissions('course:delete')
  @Delete('courses/:id')
  remove(@Param('id') id: string, @CurrentUser() u: AuthUser, @ClientInfo() c: { ip?: string }) {
    return this.courses.remove(parseId(id), u.id, c.ip);
  }
}
