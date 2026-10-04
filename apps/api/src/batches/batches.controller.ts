import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { ClientInfo, CurrentUser, RequirePermissions } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { pagination, parseId, uuid } from '../common/utils.js';
import { BatchesService } from './batches.service.js';

const mode = z.enum(['ONLINE', 'OFFLINE', 'HYBRID']);
const role = z.enum(['LEAD', 'ASSISTANT', 'GUEST']);
const date = z.coerce.date();

const createSchema = z.object({
  courseId: uuid,
  code: z.string().trim().regex(/^[A-Za-z0-9-]{1,12}$/).optional(),
  capacity: z.number().int().min(1).max(1000),
  mode: mode.optional(),
  location: z.string().max(160).nullish(),
  scheduleNote: z.string().max(200).nullish(),
  shift: z.string().max(40).nullish(),
  startDate: date,
  endDate: date.nullish(),
  instructors: z.array(z.object({ instructorId: uuid, role: role.optional() })).max(10).optional(),
});
const updateSchema = z.object({
  capacity: z.number().int().min(1).max(1000).optional(),
  mode: mode.optional(),
  location: z.string().max(160).nullish(),
  scheduleNote: z.string().max(200).nullish(),
  shift: z.string().max(40).nullish(),
  startDate: date.optional(),
  endDate: date.nullish(),
  status: z.enum(['ARCHIVED', 'COMPLETED']).optional(),
});
const nextSchema = z.object({
  startDate: date,
  endDate: date.nullish(),
  copyStudents: z.boolean().optional(),
  copyInstructors: z.boolean().optional(),
});
const assignSchema = z.object({ instructorId: uuid, role });
const listQuery = pagination.extend({
  courseId: uuid.optional(),
  instructorId: uuid.optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'FULL', 'COMPLETED', 'ARCHIVED']).optional(),
});

type Ctx = { ip?: string };

@Controller('batches')
export class BatchesController {
  constructor(private readonly batches: BatchesService) {}

  @RequirePermissions('batch:read')
  @Get()
  list(@Query(new ZodPipe(listQuery)) q: z.infer<typeof listQuery>) {
    return this.batches.list(q);
  }

  @RequirePermissions('batch:read')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.batches.get(parseId(id));
  }

  @RequirePermissions('batch:read', 'student:read')
  @Get(':id/students')
  roster(@Param('id') id: string) {
    return this.batches.roster(parseId(id));
  }

  @RequirePermissions('batch:create')
  @Post()
  create(@Body(new ZodPipe(createSchema)) b: z.infer<typeof createSchema>, @CurrentUser() u: AuthUser, @ClientInfo() c: Ctx) {
    return this.batches.create(b, u.id, c.ip);
  }

  @RequirePermissions('batch:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodPipe(updateSchema)) b: z.infer<typeof updateSchema>, @CurrentUser() u: AuthUser, @ClientInfo() c: Ctx) {
    return this.batches.update(parseId(id), b, u.id, c.ip);
  }

  @RequirePermissions('batch:create')
  @Post(':id/next')
  createNext(@Param('id') id: string, @Body(new ZodPipe(nextSchema)) b: z.infer<typeof nextSchema>, @CurrentUser() u: AuthUser, @ClientInfo() c: Ctx) {
    return this.batches.createNext(parseId(id), b, u.id, c.ip);
  }

  @RequirePermissions('batch:update')
  @Post(':id/instructors')
  assign(@Param('id') id: string, @Body(new ZodPipe(assignSchema)) b: z.infer<typeof assignSchema>, @CurrentUser() u: AuthUser, @ClientInfo() c: Ctx) {
    return this.batches.assignInstructor(parseId(id), b, u.id, c.ip);
  }

  @RequirePermissions('batch:update')
  @Delete(':id/instructors/:instructorId')
  unassign(@Param('id') id: string, @Param('instructorId') instructorId: string, @CurrentUser() u: AuthUser, @ClientInfo() c: Ctx) {
    return this.batches.unassignInstructor(parseId(id), parseId(instructorId), u.id, c.ip);
  }
}
