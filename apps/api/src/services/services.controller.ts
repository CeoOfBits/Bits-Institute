import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { ClientInfo, CurrentUser, Public, RequirePermissions, Roles } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { pagination, parseId, uuid } from '../common/utils.js';
import { ServicesService } from './services.service.js';

const publicRequestSchema = z.object({
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(7).max(30),
  companyName: z.string().max(100).optional(),
  category: z.string().min(2).max(100),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(3000),
  budgetRange: z.string().max(100).optional(),
  preferredDeadline: z.coerce.date().optional(),
});

const listRequestsQuery = pagination.extend({
  search: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  status: z.string().max(50).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'UNDER_REVIEW',
    'QUOTATION_SENT',
    'APPROVED',
    'IN_PROGRESS',
    'DELIVERED',
    'COMPLETED',
    'REJECTED',
    'ON_HOLD',
    'CANCELLED',
  ]),
  notes: z.string().max(500).optional(),
});

const updateQuotationSchema = z.object({
  quotedAmountMinor: z.number().int().min(0).optional(),
  approvedAmountMinor: z.number().int().min(0).optional(),
  assignedTo: z.string().max(100).optional(),
  internalNotes: z.string().max(2000).optional(),
  clientNotes: z.string().max(2000).optional(),
});

const recordPaymentSchema = z.object({
  amountMinor: z.number().int().min(100), // at least PKR 1.00
  currency: z.string().default('PKR'),
  type: z.enum(['ADVANCE', 'MILESTONE', 'FINAL', 'ADJUSTMENT', 'REFUND']).default('MILESTONE'),
  method: z.string().min(2).max(50).default('BANK_TRANSFER'),
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  invoiceNo: z.string().max(100).optional(),
  paidAt: z.coerce.date().optional(),
});

const recordExpenseSchema = z.object({
  title: z.string().min(3).max(200),
  amountMinor: z.number().int().min(100),
  currency: z.string().default('PKR'),
  category: z.string().min(2).max(50).default('HARDWARE'),
  receiptRef: z.string().max(100).optional(),
  incurredAt: z.coerce.date().optional(),
});

type Ctx = { ip?: string };

@Controller()
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Public()
  @Post('public/services/request')
  createPublicRequest(
    @Body(new ZodPipe(publicRequestSchema)) body: z.infer<typeof publicRequestSchema>,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.services.createPublicRequest(body, ctx.ip);
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin/services/requests')
  listRequests(@Query(new ZodPipe(listRequestsQuery)) q: z.infer<typeof listRequestsQuery>) {
    return this.services.listRequests(q);
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin/services/requests/:id')
  getRequestById(@Param('id') id: string) {
    return this.services.getRequestById(parseId(id));
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch('admin/services/requests/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodPipe(updateStatusSchema)) body: z.infer<typeof updateStatusSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.services.updateStatus(
      parseId(id),
      body.status,
      `${user.firstName} ${user.lastName}`,
      body.notes,
    );
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch('admin/services/requests/:id/quotation')
  updateQuotation(
    @Param('id') id: string,
    @Body(new ZodPipe(updateQuotationSchema)) body: z.infer<typeof updateQuotationSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.services.updateQuotation(
      parseId(id),
      body,
      `${user.firstName} ${user.lastName}`,
    );
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('admin/services/requests/:id/payments')
  recordPayment(
    @Param('id') id: string,
    @Body(new ZodPipe(recordPaymentSchema)) body: z.infer<typeof recordPaymentSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.services.recordPayment(
      parseId(id),
      body,
      `${user.firstName} ${user.lastName}`,
    );
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('admin/services/requests/:id/expenses')
  recordExpense(
    @Param('id') id: string,
    @Body(new ZodPipe(recordExpenseSchema)) body: z.infer<typeof recordExpenseSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.services.recordExpense(
      parseId(id),
      body,
      `${user.firstName} ${user.lastName}`,
    );
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin/services/financial-summary')
  getFinancialSummary() {
    return this.services.getFinancialSummary();
  }
}
