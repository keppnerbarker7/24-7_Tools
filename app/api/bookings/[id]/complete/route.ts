import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/bookings";
import { getCurrentUser } from "@/lib/auth";

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

    // Update booking status to completed
    const booking = await updateBookingStatus(id, "completed");

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error marking booking as complete:", error);
    return NextResponse.json(
      { error: "Failed to mark booking as complete" },
      { status: 500 }
    );
  }
}
