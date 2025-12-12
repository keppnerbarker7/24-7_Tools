import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/bookings";
import { getCurrentUser } from "@/lib/auth";
import { sendBookingConfirmation } from "@/lib/emails/send-booking-confirmation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get booking details
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only resend for confirmed bookings with access codes
    if (booking.status !== "confirmed" || !booking.accessCode) {
      return NextResponse.json(
        {
          error:
            "Can only resend confirmation emails for confirmed bookings with access codes",
        },
        { status: 400 }
      );
    }

    // Send confirmation email
    await sendBookingConfirmation({
      to: booking.customerEmail,
      customerName: booking.customerName,
      toolName: booking.tool.name,
      rentalStartDate: booking.rentalStartDate,
      rentalEndDate: booking.rentalEndDate,
      accessCode: booking.accessCode,
      totalAmount: booking.totalAmount,
      rentalFee: booking.rentalFee,
      depositAmount: booking.depositAmount,
      bookingId: booking.id,
    });

    return NextResponse.json({
      success: true,
      message: "Confirmation email resent successfully",
    });
  } catch (error) {
    console.error("Error resending confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to resend confirmation email" },
      { status: 500 }
    );
  }
}
