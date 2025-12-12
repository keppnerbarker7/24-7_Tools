"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tool = {
  id: string;
  name: string;
  slug: string;
  isFeatured: boolean;
  isActive: boolean;
};

type Props = {
  tool: Tool;
};

export default function ToolActions({ tool }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleFeatured = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tools/${tool.id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !tool.isFeatured }),
      });

      if (!response.ok) throw new Error("Failed to update");

      router.refresh();
    } catch (error) {
      alert("Failed to update featured status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${tool.name}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tools/${tool.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete tool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/tools/${tool.slug}`}
        target="_blank"
        className="text-gray-600 hover:text-gray-900 text-sm"
        title="View on site"
      >
        👁️
      </Link>
      <button
        onClick={handleToggleFeatured}
        disabled={loading}
        className="text-gray-600 hover:text-yellow-600 text-sm disabled:opacity-50"
        title={tool.isFeatured ? "Unfeature" : "Feature"}
      >
        {tool.isFeatured ? "⭐" : "☆"}
      </button>
      <Link
        href={`/admin/tools/${tool.id}/edit`}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
