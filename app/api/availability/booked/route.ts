import { NextResponse } from "next/server";
import { getBookedDates } from "@/lib/availability";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolId } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: "Missing required field: toolId" },
        { status: 400 }
      );
    }

    const bookedDates = await getBookedDates(toolId);

    return NextResponse.json({ bookedDates });
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch booked dates" },
      { status: 500 }
    );
  }
}
