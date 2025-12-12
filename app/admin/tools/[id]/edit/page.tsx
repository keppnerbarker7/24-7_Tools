import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/categories";
import ToolForm from "@/components/admin/ToolForm";

type Props = {
  params: Promise<{ id: string }>;
};

async function getToolForEdit(id: string) {
  const tool = await prisma.tool.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!tool) return null;

  return {
    ...tool,
    dailyRate: Number(tool.dailyRate),
    depositAmount: Number(tool.depositAmount),
  };
}

export default async function EditToolPage({ params }: Props) {
  const { id } = await params;
  const [tool, categories] = await Promise.all([
    getToolForEdit(id),
    getAllCategories(),
  ]);

  if (!tool) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Tool</h1>
        <p className="text-gray-600">Update tool information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <ToolForm categories={categories} tool={tool} isEdit />
      </div>
    </div>
  );
}
