"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { generateSlug } from "@/lib/client-utils";

type Props = {
  categories: Category[];
  tool?: any;
  isEdit?: boolean;
};

export default function ToolForm({ categories, tool, isEdit = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: tool?.name || "",
    description: tool?.description || "",
    categoryId: tool?.categoryId || categories[0]?.id || "",
    dailyRate: tool?.dailyRate || "",
    depositAmount: tool?.depositAmount || "",
    imageUrl: tool?.imageUrl || "",
    igloohomeLockId: tool?.igloohomeLockId || process.env.NEXT_PUBLIC_IGLOOHOME_LOCK_ID || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const slug = generateSlug(formData.name);

      const url = isEdit ? `/api/admin/tools/${tool.id}` : "/api/admin/tools";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug,
          dailyRate: parseFloat(formData.dailyRate),
          depositAmount: parseFloat(formData.depositAmount),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save tool");
      }

      router.push("/admin/tools");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Tool Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="e.g., Power Drill"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Detailed description of the tool..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-2">
            Daily Rate ($) *
          </label>
          <input
            id="dailyRate"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.dailyRate}
            onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="25.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount ($) *
          </label>
          <input
            id="depositAmount"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.depositAmount}
            onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="50.00"
          />
        </div>

        <div>
          <label htmlFor="igloohomeLockId" className="block text-sm font-medium text-gray-700 mb-2">
            Igloohome Lock ID
          </label>
          <input
            id="igloohomeLockId"
            type="text"
            value={formData.igloohomeLockId}
            onChange={(e) => setFormData({ ...formData, igloohomeLockId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Optional - defaults to main lock"
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="https://example.com/image.jpg (optional)"
        />
        <p className="mt-2 text-sm text-gray-500">
          For now, enter a direct image URL. Full upload functionality coming in Phase 3.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEdit ? "Update Tool" : "Add Tool"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
