// Client-side utility functions (no Prisma or server-only code)

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Calculate total price for a rental (CLIENT-SAFE VERSION)
 * @param dailyRate - The daily rental rate
 * @param depositAmount - The deposit amount
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @returns Object with subtotal, deposit, and total
 */
export function calculateRentalPrice(
  dailyRate: number,
  depositAmount: number,
  startDate: Date,
  endDate: Date
): {
  days: number;
  subtotal: number;
  deposit: number;
  total: number;
} {
  // Calculate number of days (inclusive)
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;

  const subtotal = dailyRate * days;
  const deposit = depositAmount;
  const total = subtotal + deposit;

  return {
    days,
    subtotal,
    deposit,
    total,
  };
}
