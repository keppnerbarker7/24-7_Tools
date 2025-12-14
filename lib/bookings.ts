import { prisma } from "@/lib/prisma";
import { Booking } from "@/types";

/**
 * Create a new booking
 */
export async function createBooking(data: {
  toolId: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  totalAmount: number;
  rentalFee: number;
  depositAmount: number;
  status: string;
  paymentIntentId?: string;
  trafficSource?: string | null;
  fbListingId?: string | null;
}): Promise<Booking> {
  const booking = await prisma.booking.create({
    data: {
      toolId: data.toolId,
      userId: data.userId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      rentalStartDate: data.rentalStartDate,
      rentalEndDate: data.rentalEndDate,
      totalAmount: data.totalAmount,
      rentalFee: data.rentalFee,
      depositAmount: data.depositAmount,
      status: data.status,
      paymentIntentId: data.paymentIntentId,
      trafficSource: data.trafficSource || null,
      fbListingId: data.fbListingId || null,
    },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
    },
  });

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking;
}

/**
 * Get a booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
      user: true,
    },
  });

  if (!booking) {
    return null;
  }

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking;
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  id: string,
  status: string
): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
    },
  });

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking;
}

/**
 * Update booking payment intent ID
 */
export async function updateBookingPaymentIntent(
  id: string,
  paymentIntentId: string
): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id },
    data: { paymentIntentId },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
    },
  });

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking;
}

/**
 * Update booking with access code
 */
export async function updateBookingAccessCode(
  id: string,
  accessCode: string
): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      accessCode,
      status: "confirmed",
    },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
    },
  });

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking;
}

/**
 * Get booking by payment intent ID
 */
export async function getBookingByPaymentIntentId(
  paymentIntentId: string
): Promise<Booking | null> {
  const booking = await prisma.booking.findFirst({
    where: { paymentIntentId },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!booking) {
    return null;
  }

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking;
}

/**
 * Get all bookings for a user
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      tool: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings.map((booking) => ({
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking));
}

/**
 * Get all bookings (admin only)
 */
export async function getAllBookings(): Promise<Booking[]> {
  const bookings = await prisma.booking.findMany({
    include: {
      tool: {
        include: {
          category: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings.map((booking) => ({
    ...booking,
    totalAmount: Number(booking.totalAmount),
    rentalFee: Number(booking.rentalFee),
    depositAmount: Number(booking.depositAmount),
    tool: {
      ...booking.tool,
      dailyRate: Number(booking.tool.dailyRate),
      depositAmount: Number(booking.tool.depositAmount),
    },
  } as Booking));
}
