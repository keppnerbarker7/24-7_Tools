import { prisma } from "@/lib/prisma";
import { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return await prisma.category.findUnique({
    where: { slug },
  });
}
