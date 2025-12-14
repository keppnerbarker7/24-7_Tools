import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/bookings";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: booking.status,
      accessCode: booking.accessCode,
    });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking status" },
      { status: 500 }
    );
  }
}
