import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/bookings";
import { format } from "date-fns";
import Link from "next/link";
import ConfirmationPageClient from "@/components/booking/ConfirmationPageClient";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking || !booking.tool) {
    notFound();
  }

  const isConfirmed = booking.status === "confirmed" || booking.status === "pending_code";
  const isPending = booking.status === "pending";
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Auto-refresh for pending payments */}
        <ConfirmationPageClient bookingId={booking.id} initialStatus={booking.status} />

        {/* Success Header */}
        {isConfirmed && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-green-900">
                  Booking Confirmed!
                </h1>
                <p className="text-green-700 mt-1">
                  Your rental has been successfully booked.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Header */}
        {isPending && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-yellow-900">
                  Payment Pending
                </h1>
                <p className="text-yellow-700 mt-1">
                  We're processing your payment. Please wait a moment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Header */}
        {isCancelled && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-red-900">
                  Booking Cancelled
                </h1>
                <p className="text-red-700 mt-1">
                  This booking has been cancelled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Booking Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-mono text-sm text-gray-900">
                {booking.id}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Tool</span>
              <span className="font-semibold text-gray-900">
                {booking.tool.name}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Rental Period</span>
              <span className="text-gray-900">
                {format(new Date(booking.rentalStartDate), "MMM d, yyyy")} -{" "}
                {format(new Date(booking.rentalEndDate), "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Customer Name</span>
              <span className="text-gray-900">{booking.customerName}</span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900">{booking.customerEmail}</span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Phone</span>
              <span className="text-gray-900">{booking.customerPhone}</span>
            </div>

            {/* Access Code - Only show if confirmed */}
            {booking.status === "confirmed" && booking.accessCode && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 my-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-900 uppercase tracking-wide mb-2">
                    🔑 Your Access Code
                  </p>
                  <p className="text-4xl font-bold text-green-700 tracking-widest font-mono">
                    {booking.accessCode}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Use this code to unlock the tool storage
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Rental Fee</span>
              <span className="text-gray-900">
                $
                {(booking.totalAmount - booking.depositAmount).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Security Deposit</span>
              <span className="text-gray-900">
                ${booking.depositAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-lg font-semibold text-gray-900">
                Total Paid
              </span>
              <span className="text-lg font-bold text-gray-900">
                ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {isConfirmed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              What's Next?
            </h2>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  You will receive an email confirmation with pickup details
                  shortly.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Your access code for the tool lockbox will be sent before your
                  rental start date.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Your security deposit will be refunded after the rental period
                  ends.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/tools"
            className="flex-1 bg-white text-blue-600 border-2 border-blue-600 text-center py-3 px-4 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            Browse More Tools
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Questions? Contact us at{" "}
            <a
              href="mailto:support@utahvalleytoolrental.com"
              className="text-blue-600 hover:underline"
            >
              support@utahvalleytoolrental.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
