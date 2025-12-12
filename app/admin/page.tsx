import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getDashboardStats() {
  const [toolCount, activeToolCount, bookingCount, categoryCount] = await Promise.all([
    prisma.tool.count(),
    prisma.tool.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.category.count(),
  ]);

  return {
    toolCount,
    activeToolCount,
    bookingCount,
    categoryCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tools</p>
              <p className="text-3xl font-bold text-gray-900">{stats.toolCount}</p>
            </div>
            <div className="text-4xl">🔧</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Tools</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeToolCount}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{stats.bookingCount}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-purple-600">{stats.categoryCount}</p>
            </div>
            <div className="text-4xl">📂</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/tools/new"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-gray-900">Add New Tool</p>
              <p className="text-sm text-gray-600">Add a tool to inventory</p>
            </div>
          </Link>

          <Link
            href="/admin/tools"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">🔧</span>
            <div>
              <p className="font-medium text-gray-900">Manage Tools</p>
              <p className="text-sm text-gray-600">Edit or delete tools</p>
            </div>
          </Link>

          <Link
            href="/admin/bookings"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-medium text-gray-900">View Bookings</p>
              <p className="text-sm text-gray-600">Manage reservations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
