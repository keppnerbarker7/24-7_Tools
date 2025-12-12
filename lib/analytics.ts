import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  conversionRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topTools: { toolId: string; toolName: string; bookings: number; revenue: number }[];
  trafficSources: { source: string; bookings: number; percentage: number }[];
  recentBookings: number;
}

/**
 * Get analytics metrics for the admin dashboard
 */
export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  // Get all bookings
  const allBookings = await prisma.booking.findMany({
    include: {
      tool: true,
    },
  });

  // Calculate total revenue (only from confirmed and completed bookings)
  const paidBookings = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  );
  const totalRevenue = paidBookings.reduce(
    (sum, b) => sum + Number(b.totalAmount),
    0
  );

  // Calculate booking counts
  const totalBookings = allBookings.length;
  const confirmedBookings = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  ).length;
  const cancelledBookings = allBookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  // Calculate average booking value
  const averageBookingValue =
    paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;

  // Calculate conversion rate (confirmed / total)
  const conversionRate =
    totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

  // Calculate monthly revenue for last 6 months
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthBookings = paidBookings.filter((b) => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate >= monthStart && bookingDate <= monthEnd;
    });

    const revenue = monthBookings.reduce(
      (sum, b) => sum + Number(b.totalAmount),
      0
    );

    monthlyRevenue.push({
      month: format(monthDate, "MMM yyyy"),
      revenue,
    });
  }

  // Calculate top tools by bookings and revenue
  const toolStats = new Map<
    string,
    { toolName: string; bookings: number; revenue: number }
  >();

  paidBookings.forEach((booking) => {
    const toolId = booking.toolId;
    const existing = toolStats.get(toolId) || {
      toolName: booking.tool.name,
      bookings: 0,
      revenue: 0,
    };

    toolStats.set(toolId, {
      toolName: booking.tool.name,
      bookings: existing.bookings + 1,
      revenue: existing.revenue + Number(booking.totalAmount),
    });
  });

  const topTools = Array.from(toolStats.entries())
    .map(([toolId, stats]) => ({
      toolId,
      toolName: stats.toolName,
      bookings: stats.bookings,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate traffic sources
  const sourceStats = new Map<string, number>();
  allBookings.forEach((booking) => {
    const source = booking.trafficSource || "Direct";
    sourceStats.set(source, (sourceStats.get(source) || 0) + 1);
  });

  const trafficSources = Array.from(sourceStats.entries())
    .map(([source, bookings]) => ({
      source,
      bookings,
      percentage: totalBookings > 0 ? (bookings / totalBookings) * 100 : 0,
    }))
    .sort((a, b) => b.bookings - a.bookings);

  // Recent bookings (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentBookings = allBookings.filter(
    (b) => new Date(b.createdAt) >= sevenDaysAgo
  ).length;

  return {
    totalRevenue,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    averageBookingValue,
    conversionRate,
    monthlyRevenue,
    topTools,
    trafficSources,
    recentBookings,
  };
}
