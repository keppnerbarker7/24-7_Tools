import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        toolId: id,
        status: { in: ["pending", "confirmed", "pending_code"] },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: `Cannot delete tool with ${activeBookings} active booking(s)` },
        { status: 400 }
      );
    }

    // Soft delete (set isActive to false)
    await prisma.tool.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const tool = await prisma.tool.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...tool,
      dailyRate: Number(tool.dailyRate),
      depositAmount: Number(tool.depositAmount),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tool" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = await request.json();

    const tool = await prisma.tool.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        dailyRate: data.dailyRate,
        depositAmount: data.depositAmount,
        imageUrl: data.imageUrl,
        igloohomeLockId: data.igloohomeLockId,
      },
    });

    return NextResponse.json({
      ...tool,
      dailyRate: Number(tool.dailyRate),
      depositAmount: Number(tool.depositAmount),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    );
  }
}
