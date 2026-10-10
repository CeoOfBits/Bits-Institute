import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module.js';
import { AuditService } from '../audit/audit.module.js';
import { pageMeta } from '../common/utils.js';

export interface CreateServiceRequestDto {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  category: string;
  title: string;
  description: string;
  budgetRange?: string;
  preferredDeadline?: Date;
}

export interface RecordPaymentDto {
  amountMinor: number;
  currency?: string;
  type?: string;
  method?: string;
  reference?: string;
  notes?: string;
  paidAt?: Date;
  invoiceNo?: string;
}

export interface RecordExpenseDto {
  title: string;
  amountMinor: number;
  currency?: string;
  category?: string;
  receiptRef?: string;
  incurredAt?: Date;
}

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ───────────────────────── Public Service Requests ─────────────────────────

  async createPublicRequest(dto: CreateServiceRequestDto, ip?: string) {
    const year = new Date().getFullYear();
    const count = await this.prisma.serviceRequest.count();
    const ticketNumber = `SR-${year}-${String(count + 1).padStart(4, '0')}`;

    const request = await this.prisma.serviceRequest.create({
      data: {
        ticketNumber,
        clientName: dto.clientName.trim(),
        clientEmail: dto.clientEmail.trim().toLowerCase(),
        clientPhone: dto.clientPhone.trim(),
        companyName: dto.companyName?.trim() || null,
        category: dto.category.trim(),
        title: dto.title.trim(),
        description: dto.description.trim(),
        budgetRange: dto.budgetRange || null,
        preferredDeadline: dto.preferredDeadline || null,
        status: 'NEW',
        activityLogs: {
          create: {
            action: 'REQUEST_SUBMITTED',
            actor: dto.clientName,
            details: `Project inquiry submitted for ${dto.category}`,
          },
        },
      },
    });

    return {
      success: true,
      ticketNumber: request.ticketNumber,
      message: 'Your service project request has been submitted successfully. Our engineering team will review it and contact you within 24 hours.',
    };
  }

  // ───────────────────────── Admin Management ─────────────────────────

  async listRequests(q: {
    search?: string;
    category?: string;
    status?: string;
    page: number;
    pageSize: number;
  }) {
    const where: any = {};
    if (q.search) {
      where.OR = [
        { ticketNumber: { contains: q.search, mode: 'insensitive' } },
        { clientName: { contains: q.search, mode: 'insensitive' } },
        { clientEmail: { contains: q.search, mode: 'insensitive' } },
        { title: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    if (q.category) where.category = q.category;
    if (q.status) where.status = q.status;

    const [total, items] = await Promise.all([
      this.prisma.serviceRequest.count({ where }),
      this.prisma.serviceRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: {
          payments: { select: { amountMinor: true } },
          expenses: { select: { amountMinor: true } },
        },
      }),
    ]);

    const enriched = items.map((item) => {
      const totalPaidMinor = item.payments.reduce((acc, p) => acc + p.amountMinor, 0);
      const totalExpensesMinor = item.expenses.reduce((acc, e) => acc + e.amountMinor, 0);
      const outstandingBalanceMinor = Math.max(0, item.approvedAmountMinor - totalPaidMinor);
      const netProfitMinor = totalPaidMinor - totalExpensesMinor;

      return {
        ...item,
        financials: {
          quotedAmountMinor: item.quotedAmountMinor,
          approvedAmountMinor: item.approvedAmountMinor,
          totalPaidMinor,
          totalExpensesMinor,
          outstandingBalanceMinor,
          netProfitMinor,
        },
      };
    });

    return { items: enriched, meta: pageMeta(total, q.page, q.pageSize) };
  }

  async getRequestById(id: string) {
    const item = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        payments: { orderBy: { paidAt: 'desc' } },
        expenses: { orderBy: { incurredAt: 'desc' } },
        activityLogs: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!item) throw new NotFoundException('Service project request not found');

    const totalPaidMinor = item.payments.reduce((acc, p) => acc + p.amountMinor, 0);
    const totalExpensesMinor = item.expenses.reduce((acc, e) => acc + e.amountMinor, 0);
    const outstandingBalanceMinor = Math.max(0, item.approvedAmountMinor - totalPaidMinor);
    const netProfitMinor = totalPaidMinor - totalExpensesMinor;

    return {
      ...item,
      financials: {
        quotedAmountMinor: item.quotedAmountMinor,
        approvedAmountMinor: item.approvedAmountMinor,
        totalPaidMinor,
        totalExpensesMinor,
        outstandingBalanceMinor,
        netProfitMinor,
      },
    };
  }

  async updateStatus(
    id: string,
    status: any,
    actorName: string,
    notes?: string,
  ) {
    const item = await this.prisma.serviceRequest.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Service project request not found');

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        activityLogs: {
          create: {
            action: 'STATUS_CHANGE',
            actor: actorName,
            details: `Status transitioned from ${item.status} to ${status}${notes ? ` (Note: ${notes})` : ''}`,
          },
        },
      },
    });

    return updated;
  }

  async updateQuotation(
    id: string,
    input: {
      quotedAmountMinor?: number;
      approvedAmountMinor?: number;
      assignedTo?: string;
      internalNotes?: string;
      clientNotes?: string;
    },
    actorName: string,
  ) {
    const item = await this.prisma.serviceRequest.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Service project request not found');

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        quotedAmountMinor: input.quotedAmountMinor ?? item.quotedAmountMinor,
        approvedAmountMinor: input.approvedAmountMinor ?? item.approvedAmountMinor,
        assignedTo: input.assignedTo ?? item.assignedTo,
        internalNotes: input.internalNotes ?? item.internalNotes,
        clientNotes: input.clientNotes ?? item.clientNotes,
        activityLogs: {
          create: {
            action: 'QUOTATION_UPDATED',
            actor: actorName,
            details: `Project commercials updated: Quoted PKR ${( (input.quotedAmountMinor ?? item.quotedAmountMinor) / 100).toLocaleString()}, Approved PKR ${( (input.approvedAmountMinor ?? item.approvedAmountMinor) / 100).toLocaleString()}`,
          },
        },
      },
    });

    return updated;
  }

  // ───────────────────────── Financial Ledger: Payments & Expenses ─────────────────────────

  async recordPayment(id: string, dto: RecordPaymentDto, actorName: string) {
    const item = await this.prisma.serviceRequest.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Service project request not found');
    if (dto.amountMinor <= 0) throw new BadRequestException('Payment amount must be greater than zero');

    const year = new Date().getFullYear();
    const count = await this.prisma.servicePayment.count();
    const invoiceNo = dto.invoiceNo || `INV-${year}-${String(count + 1).padStart(4, '0')}`;

    const payment = await this.prisma.servicePayment.create({
      data: {
        requestId: id,
        invoiceNo,
        amountMinor: dto.amountMinor,
        currency: dto.currency || 'PKR',
        type: dto.type || 'MILESTONE',
        method: dto.method || 'BANK_TRANSFER',
        reference: dto.reference || null,
        notes: dto.notes || null,
        status: 'CONFIRMED',
        paidAt: dto.paidAt || new Date(),
        recordedBy: actorName,
      },
    });

    await this.prisma.serviceActivityLog.create({
      data: {
        requestId: id,
        action: 'PAYMENT_RECORDED',
        actor: actorName,
        details: `Payment of PKR ${(dto.amountMinor / 100).toLocaleString()} recorded via ${dto.method} (Ref: ${dto.reference || 'N/A'}, Inv: ${invoiceNo})`,
      },
    });

    return payment;
  }

  async recordExpense(id: string, dto: RecordExpenseDto, actorName: string) {
    const item = await this.prisma.serviceRequest.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Service project request not found');
    if (dto.amountMinor <= 0) throw new BadRequestException('Expense amount must be greater than zero');

    const expense = await this.prisma.serviceExpense.create({
      data: {
        requestId: id,
        title: dto.title.trim(),
        amountMinor: dto.amountMinor,
        currency: dto.currency || 'PKR',
        category: dto.category || 'HARDWARE',
        receiptRef: dto.receiptRef || null,
        incurredAt: dto.incurredAt || new Date(),
      },
    });

    await this.prisma.serviceActivityLog.create({
      data: {
        requestId: id,
        action: 'EXPENSE_RECORDED',
        actor: actorName,
        details: `Project expense of PKR ${(dto.amountMinor / 100).toLocaleString()} incurred for ${dto.title} (${dto.category})`,
      },
    });

    return expense;
  }

  async getFinancialSummary() {
    const [requests, payments, expenses] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        select: { quotedAmountMinor: true, approvedAmountMinor: true, status: true },
      }),
      this.prisma.servicePayment.findMany({
        select: { amountMinor: true, status: true },
      }),
      this.prisma.serviceExpense.findMany({
        select: { amountMinor: true },
      }),
    ]);

    const totalQuotedMinor = requests.reduce((acc, r) => acc + r.quotedAmountMinor, 0);
    const totalApprovedRevenueMinor = requests.reduce((acc, r) => acc + r.approvedAmountMinor, 0);
    const totalPaymentsReceivedMinor = payments.filter((p) => p.status === 'CONFIRMED').reduce((acc, p) => acc + p.amountMinor, 0);
    const totalExpensesMinor = expenses.reduce((acc, e) => acc + e.amountMinor, 0);
    const outstandingBalancesMinor = Math.max(0, totalApprovedRevenueMinor - totalPaymentsReceivedMinor);
    const netProfitMinor = totalPaymentsReceivedMinor - totalExpensesMinor;

    return {
      totalProjectsCount: requests.length,
      activeProjectsCount: requests.filter((r) => ['APPROVED', 'IN_PROGRESS'].includes(r.status)).length,
      totalQuotedMinor,
      totalApprovedRevenueMinor,
      totalPaymentsReceivedMinor,
      totalExpensesMinor,
      outstandingBalancesMinor,
      netProfitMinor,
    };
  }
}
