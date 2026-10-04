import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { ClientInfo, CurrentUser, Public, RequirePermissions } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { pagination, parseId, uuid } from '../common/utils.js';
import { CmsService } from './cms.service.js';

const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().max(100).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.any(),
  featuredImage: z.string().url().optional(),
  categoryId: uuid,
  authorId: uuid.optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'UNPUBLISHED']).optional(),
  publishedAt: z.coerce.date().optional(),
  seoTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(250).optional(),
  canonicalUrl: z.string().url().optional(),
  ogImage: z.string().url().optional(),
});

const listPublicQuery = pagination.extend({
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().max(100).optional(),
});

type Ctx = { ip?: string };

@Controller()
export class CmsController {
  constructor(private readonly cms: CmsService) {}

  @Public()
  @Get('public/blog')
  listPublic(@Query(new ZodPipe(listPublicQuery)) q: z.infer<typeof listPublicQuery>) {
    return this.cms.listPublicPosts(q);
  }

  @Public()
  @Get('public/blog/categories')
  listCategories() {
    return this.cms.listCategories();
  }

  @Public()
  @Get('public/blog/:slug')
  getPublicPost(@Param('slug') slug: string) {
    return this.cms.getPublicPost(slug);
  }

  @RequirePermissions('blog:create')
  @Post('blog/posts')
  createPost(
    @Body(new ZodPipe(postSchema)) body: z.infer<typeof postSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.cms.createPost(body, user.id, ctx.ip);
  }

  @RequirePermissions('blog:update')
  @Patch('blog/posts/:id')
  updatePost(
    @Param('id') id: string,
    @Body(new ZodPipe(postSchema.partial())) body: z.infer<typeof postSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.cms.updatePost(parseId(id), body, user.id, ctx.ip);
  }

  @RequirePermissions('blog:delete')
  @Delete('blog/posts/:id')
  deletePost(@Param('id') id: string, @CurrentUser() user: AuthUser, @ClientInfo() ctx: Ctx) {
    return this.cms.deletePost(parseId(id), user.id, ctx.ip);
  }
}
