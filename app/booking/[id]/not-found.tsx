import Link from "next/link";

export default function BookingNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-4">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          We couldn't find a booking with that ID. Please check the link and try
          again.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>

          <Link
            href="/tools"
            className="text-blue-600 hover:underline"
          >
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
