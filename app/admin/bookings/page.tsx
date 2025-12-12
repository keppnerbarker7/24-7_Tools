import { getAllBookings } from "@/lib/bookings";
import { format } from "date-fns";
import Link from "next/link";
import BookingFilters from "@/components/admin/BookingFilters";
import BookingStatusBadge from "@/components/admin/BookingStatusBadge";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status: statusFilter, search: searchQuery } = await searchParams;

  // Get all bookings
  const allBookings = await getAllBookings();

  // Filter bookings based on status and search
  let filteredBookings = allBookings;

  if (statusFilter && statusFilter !== "all") {
    filteredBookings = filteredBookings.filter(
      (booking) => booking.status === statusFilter
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredBookings = filteredBookings.filter(
      (booking) =>
        booking.customerName.toLowerCase().includes(query) ||
        booking.customerEmail.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
    );
  }

  // Calculate stats
  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    pending: allBookings.filter(
      (b) => b.status === "pending" || b.status === "pending_code"
    ).length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-1">
          Manage all tool rental bookings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {stats.confirmed}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {stats.cancelled}
          </p>
        </div>
      </div>

      {/* Filters */}
      <BookingFilters currentStatus={statusFilter} currentSearch={searchQuery} />

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rental Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {booking.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{booking.tool.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <p>
                          {format(
                            new Date(booking.rentalStartDate),
                            "MMM d, yyyy"
                          )}
                        </p>
                        <p className="text-gray-500">to</p>
                        <p>
                          {format(
                            new Date(booking.rentalEndDate),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ${booking.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {filteredBookings.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredBookings.length} of {allBookings.length} bookings
        </div>
      )}
    </div>
  );
}
