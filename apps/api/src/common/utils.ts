import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);

export const uuid = z.uuid();

export function parseId(value: string): string {
  const r = uuid.safeParse(value);
  if (!r.success) throw new BadRequestException('Invalid id');
  return r.data;
}

export const pagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export function pageMeta(total: number, page: number, pageSize: number) {
  return { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
