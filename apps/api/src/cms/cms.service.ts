import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module.js';
import { AuditService } from '../audit/audit.module.js';
import { pageMeta, slugify } from '../common/utils.js';

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: any;
  featuredImage?: string;
  categoryId: string;
  authorId?: string;
  featured?: boolean;
  status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'UNPUBLISHED';
  publishedAt?: Date;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  tags?: string[];
}

@Injectable()
export class CmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ───────────────────────── Public Blog Endpoints ─────────────────────────

  async listPublicPosts(q: { category?: string; tag?: string; search?: string; page: number; pageSize: number }) {
    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
      publishedAt: { lte: new Date() },
    };
    if (q.category) where.category = { slug: q.category };
    if (q.tag) where.tags = { some: { tag: { slug: q.tag } } };
    if (q.search) {
      where.OR = [
        { title: { contains: q.search, mode: 'insensitive' } },
        { excerpt: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.blogPost.count({ where }),
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          featured: true,
          publishedAt: true,
          category: { select: { name: true, slug: true } },
          author: {
            select: {
              user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
          tags: { select: { tag: { select: { name: true, slug: true } } } },
        },
      }),
    ]);

    return {
      items,
      meta: pageMeta(total, q.page, q.pageSize),
    };
  }

  async getPublicPost(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: {
        category: { select: { name: true, slug: true } },
        author: {
          select: {
            headline: true,
            bio: true,
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        tags: { select: { tag: { select: { name: true, slug: true } } } },
      },
    });

    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async listCategories() {
    return this.prisma.blogCategory.findMany({
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
      orderBy: { name: 'asc' },
    });
  }

  // ───────────────────────── Admin Blog Management ─────────────────────────

  async createPost(input: BlogPostInput, userId: string, ip?: string) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title);
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Post with this slug already exists');

    const post = await this.prisma.blogPost.create({
      data: {
        title: input.title,
        slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: input.featuredImage,
        categoryId: input.categoryId,
        authorId: input.authorId,
        featured: input.featured ?? false,
        status: input.status ?? 'DRAFT',
        publishedAt: input.status === 'PUBLISHED' ? (input.publishedAt ?? new Date()) : null,
        seoTitle: input.seoTitle ?? input.title,
        metaDescription: input.metaDescription ?? input.excerpt,
        canonicalUrl: input.canonicalUrl,
        ogImage: input.ogImage ?? input.featuredImage,
      },
    });

    await this.audit.record({
      userId,
      action: 'blog.create',
      entityType: 'BlogPost',
      entityId: post.id,
      metadata: { title: post.title, slug: post.slug },
      ip,
    });

    return post;
  }

  async updatePost(id: string, input: Partial<BlogPostInput>, userId: string, ip?: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');

    const data: any = { ...input };
    if (input.slug) {
      data.slug = slugify(input.slug);
      const hit = await this.prisma.blogPost.findUnique({ where: { slug: data.slug } });
      if (hit && hit.id !== id) throw new ConflictException('Slug is already in use');
    }

    if (input.status === 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    delete data.tags;

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data,
    });

    await this.audit.record({
      userId,
      action: 'blog.update',
      entityType: 'BlogPost',
      entityId: id,
      metadata: { title: updated.title },
      ip,
    });

    return updated;
  }

  async deletePost(id: string, userId: string, ip?: string) {
    await this.prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'UNPUBLISHED' },
    });
    await this.audit.record({
      userId,
      action: 'blog.delete',
      entityType: 'BlogPost',
      entityId: id,
      ip,
    });
    return { success: true };
  }
}
