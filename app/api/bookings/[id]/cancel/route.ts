import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/bookings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Update booking status to cancelled
    const booking = await updateBookingStatus(id, "cancelled");

    // TODO: When Stripe refund functionality is needed, add it here:
    // if (booking.paymentIntentId) {
    //   await stripe.refunds.create({
    //     payment_intent: booking.paymentIntentId,
    //   });
    // }

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
