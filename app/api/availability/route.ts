import { NextResponse } from "next/server";
import { checkAvailability } from "@/lib/availability";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolId, startDate, endDate } = body;

    // Validate required fields
    if (!toolId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields: toolId, startDate, endDate" },
        { status: 400 }
      );
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        { error: "End date cannot be before start date" },
        { status: 400 }
      );
    }

    if (start < new Date()) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      );
    }

    // Check availability
    const isAvailable = await checkAvailability(toolId, start, end);

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
