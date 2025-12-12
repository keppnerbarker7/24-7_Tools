import { prisma } from "@/lib/prisma";
import { Tool, ToolWithCategory } from "@/types";

export async function getToolBySlug(slug: string): Promise<ToolWithCategory | null> {
  const tool = await prisma.tool.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!tool) return null;

  return {
    ...tool,
    dailyRate: Number(tool.dailyRate),
    depositAmount: Number(tool.depositAmount),
  };
}

export async function getAllTools(): Promise<ToolWithCategory[]> {
  const tools = await prisma.tool.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return tools.map((tool) => ({
    ...tool,
    dailyRate: Number(tool.dailyRate),
    depositAmount: Number(tool.depositAmount),
  }));
}

export async function getToolsByCategory(categorySlug: string): Promise<ToolWithCategory[]> {
  const tools = await prisma.tool.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return tools.map((tool) => ({
    ...tool,
    dailyRate: Number(tool.dailyRate),
    depositAmount: Number(tool.depositAmount),
  }));
}

export async function getFeaturedTools(): Promise<ToolWithCategory[]> {
  const tools = await prisma.tool.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 6,
  });

  return tools.map((tool) => ({
    ...tool,
    dailyRate: Number(tool.dailyRate),
    depositAmount: Number(tool.depositAmount),
  }));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
