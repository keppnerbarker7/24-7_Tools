import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { isFeatured } = await request.json();

    const tool = await prisma.tool.update({
      where: { id },
      data: { isFeatured },
    });

    return NextResponse.json({ success: true, tool });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    );
  }
}
