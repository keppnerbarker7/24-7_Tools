import { prisma } from "@/lib/prisma";

/**
 * Check if a tool is available for the given date range
 * @param toolId - The tool ID to check availability for
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @returns true if available, false if conflicts exist
 */
export async function checkAvailability(
  toolId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  const conflicts = await prisma.booking.findMany({
    where: {
      toolId,
      status: { in: ["confirmed", "pending_code"] },
      OR: [
        // New booking starts during existing booking
        {
          rentalStartDate: { lte: startDate },
          rentalEndDate: { gte: startDate },
        },
        // New booking ends during existing booking
        {
          rentalStartDate: { lte: endDate },
          rentalEndDate: { gte: endDate },
        },
        // New booking completely contains existing booking
        {
          rentalStartDate: { gte: startDate },
          rentalEndDate: { lte: endDate },
        },
      ],
    },
  });

  return conflicts.length === 0;
}

/**
 * Get all booked date ranges for a tool
 * @param toolId - The tool ID to get bookings for
 * @returns Array of booked date ranges
 */
export async function getBookedDates(
  toolId: string
): Promise<Array<{ start: Date; end: Date }>> {
  const bookings = await prisma.booking.findMany({
    where: {
      toolId,
      status: { in: ["confirmed", "pending_code"] },
      rentalEndDate: { gte: new Date() }, // Only future/current bookings
    },
    select: {
      rentalStartDate: true,
      rentalEndDate: true,
    },
    orderBy: {
      rentalStartDate: "asc",
    },
  });

  return bookings.map((booking) => ({
    start: booking.rentalStartDate,
    end: booking.rentalEndDate,
  }));
}

/**
 * Calculate total price for a rental
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
