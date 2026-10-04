import type { PrismaService } from '../prisma/prisma.module.js';

type Db = Pick<PrismaService, 'batchEnrollment'>;

/** Active student count per batch. */
export async function seatMap(db: Db, batchIds: string[]): Promise<Map<string, number>> {
  if (!batchIds.length) return new Map();
  const rows = await db.batchEnrollment.groupBy({
    by: ['batchId'],
    where: { batchId: { in: batchIds }, status: 'ACTIVE' },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.batchId, r._count._all]));
}

export function seatInfo(batch: { capacity: number; status: string }, enrolled: number) {
  const remaining = Math.max(0, batch.capacity - enrolled);
  const closed = batch.status === 'COMPLETED' || batch.status === 'ARCHIVED';
  return {
    enrolled,
    seatsRemaining: remaining,
    seatsLabel: remaining === 0 ? 'FULL' : remaining === 1 ? '1 seat remaining' : `${remaining} seats remaining`,
    effectiveStatus: closed ? batch.status : remaining === 0 ? 'FULL' : batch.status === 'FULL' ? 'ACTIVE' : batch.status,
  };
}
