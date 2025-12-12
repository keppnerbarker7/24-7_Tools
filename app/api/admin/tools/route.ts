import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();

    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        dailyRate: data.dailyRate,
        depositAmount: data.depositAmount,
        imageUrl: data.imageUrl || null,
        igloohomeLockId: data.igloohomeLockId || null,
      },
    });

    return NextResponse.json({
      ...tool,
      dailyRate: Number(tool.dailyRate),
      depositAmount: Number(tool.depositAmount),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create tool" },
      { status: 500 }
    );
  }
}
