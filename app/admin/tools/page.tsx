import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ToolActions from "@/components/admin/ToolActions";

async function getAllToolsAdmin() {
  const tools = await prisma.tool.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return tools.map((tool) => ({
    ...tool,
    dailyRate: Number(tool.dailyRate),
    depositAmount: Number(tool.depositAmount),
  }));
}

export default async function AdminToolsPage() {
  const tools = await getAllToolsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools</h1>
          <p className="text-gray-600">Manage your tool inventory</p>
        </div>
        <Link
          href="/admin/tools/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add New Tool
        </Link>
      </div>

      {/* Tools Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {tools.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No tools yet</p>
            <Link
              href="/admin/tools/new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first tool →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tool
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tool.imageUrl ? (
                          <img
                            src={tool.imageUrl}
                            alt={tool.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{tool.name}</p>
                          <p className="text-sm text-gray-500">{tool.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tool.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${tool.dailyRate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {tool.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {tool.isFeatured && (
                        <span className="text-yellow-500 text-lg">⭐</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ToolActions tool={tool} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
