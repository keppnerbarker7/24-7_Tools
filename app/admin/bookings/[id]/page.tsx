import { getBookingById } from "@/lib/bookings";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingStatusBadge from "@/components/admin/BookingStatusBadge";
import BookingActions from "@/components/admin/BookingActions";
import { BookingWithDetails } from "@/types";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookingData = await getBookingById(id);

  if (!bookingData || !bookingData.tool) {
    notFound();
  }

  // Type assertion since we've verified tool exists
  const booking = bookingData as BookingWithDetails;

  const rentalDays = Math.ceil(
    (new Date(booking.rentalEndDate).getTime() -
      new Date(booking.rentalStartDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      {/* Header with Back Button */}
      <div className="mb-8">
        <Link
          href="/admin/bookings"
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Bookings
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Details
            </h1>
            <p className="text-gray-600 mt-1 font-mono text-sm">
              ID: {booking.id}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tool Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tool Information
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-start gap-4">
                {booking.tool.imageUrl && (
                  <img
                    src={booking.tool.imageUrl}
                    alt={booking.tool.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {booking.tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.tool.category.name}
                  </p>
                  {booking.tool.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      {booking.tool.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.customerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={`mailto:${booking.customerEmail}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {booking.customerEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {booking.customerPhone}
                    </a>
                  </dd>
                </div>
                {booking.trafficSource && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Traffic Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {booking.trafficSource}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Rental Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Rental Details
              </h2>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Rental Start
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(
                      new Date(booking.rentalStartDate),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Rental End
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(
                      new Date(booking.rentalEndDate),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Rental Duration
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {rentalDays} {rentalDays === 1 ? "day" : "days"}
                  </dd>
                </div>
                {booking.accessCode && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Access Code
                    </dt>
                    <dd className="mt-1 text-xl font-bold text-green-700 font-mono tracking-widest">
                      {booking.accessCode}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h2>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Rental Fee</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${booking.rentalFee.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Security Deposit</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${booking.depositAmount.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <dt className="text-base font-semibold text-gray-900">
                    Total Amount
                  </dt>
                  <dd className="text-base font-bold text-gray-900">
                    ${booking.totalAmount.toFixed(2)}
                  </dd>
                </div>
                {booking.paymentIntentId && (
                  <div className="pt-3 border-t border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Intent ID
                    </dt>
                    <dd className="mt-1 text-xs font-mono text-gray-700 break-all">
                      {booking.paymentIntentId}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-1 space-y-6">
          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            </div>
            <div className="px-6 py-4">
              <BookingActions bookingId={booking.id} status={booking.status} />
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">
                      Booking Created
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(
                        new Date(booking.createdAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>

                {booking.status === "confirmed" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900">
                        Payment Confirmed
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Access code generated
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        booking.status === "completed"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          booking.status === "completed"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {booking.status === "completed"
                        ? "Rental Completed"
                        : "Awaiting Completion"}
                    </p>
                    {booking.status === "completed" ? (
                      <p className="text-xs text-gray-500 mt-1">
                        Tool returned successfully
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Expected:{" "}
                        {format(new Date(booking.rentalEndDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                System Information
              </h2>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-2 text-xs">
                <div>
                  <dt className="text-gray-500">Created At</dt>
                  <dd className="text-gray-900 font-mono">
                    {format(
                      new Date(booking.createdAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900 font-mono">
                    {format(
                      new Date(booking.updatedAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
