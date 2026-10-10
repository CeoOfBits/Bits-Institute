import { describe, it, expect } from 'vitest';

describe('Services Financial Calculations', () => {
  it('correctly calculates outstanding balance and net profit', () => {
    const quotedAmountMinor = 15000000; // PKR 150,000
    const approvedAmountMinor = 13500000; // PKR 135,000
    const payments = [
      { amountMinor: 5000000 }, // Advance PKR 50,000
      { amountMinor: 4000000 }, // Milestone PKR 40,000
    ];
    const expenses = [
      { amountMinor: 1200000 }, // Server Hosting PKR 12,000
      { amountMinor: 800000 },  // Hardware cables PKR 8,000
    ];

    const totalPaidMinor = payments.reduce((acc, p) => acc + p.amountMinor, 0);
    const totalExpensesMinor = expenses.reduce((acc, e) => acc + e.amountMinor, 0);
    const outstandingBalanceMinor = Math.max(0, approvedAmountMinor - totalPaidMinor);
    const netProfitMinor = totalPaidMinor - totalExpensesMinor;

    expect(totalPaidMinor).toBe(9000000); // PKR 90,000
    expect(totalExpensesMinor).toBe(2000000); // PKR 20,000
    expect(outstandingBalanceMinor).toBe(4500000); // PKR 45,000 pending
    expect(netProfitMinor).toBe(7000000); // PKR 70,000 profit
  });

  it('prevents negative outstanding balance if overpaid or adjusted', () => {
    const approvedAmountMinor = 5000000;
    const payments = [{ amountMinor: 6000000 }];
    const totalPaidMinor = payments.reduce((acc, p) => acc + p.amountMinor, 0);
    const outstandingBalanceMinor = Math.max(0, approvedAmountMinor - totalPaidMinor);

    expect(outstandingBalanceMinor).toBe(0);
  });
});
