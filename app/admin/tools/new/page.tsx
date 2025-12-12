import { getAllCategories } from "@/lib/categories";
import ToolForm from "@/components/admin/ToolForm";

export default async function NewToolPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Tool</h1>
        <p className="text-gray-600">Add a new tool to your inventory</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <ToolForm categories={categories} />
      </div>
    </div>
  );
}
