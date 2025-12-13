import Link from "next/link";

export default function ToolNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tool Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the tool you're looking for. It may have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/tools"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse All Tools
        </Link>
      </div>
    </div>
  );
}
