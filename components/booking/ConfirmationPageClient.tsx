"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPageClient({
  bookingId,
  initialStatus
}: {
  bookingId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    // If already confirmed, no need to poll
    if (status === "confirmed" || status === "pending_code") {
      return;
    }

    // Poll for status updates every 2 seconds for up to 30 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}/status`);
        const data = await response.json();

        if (data.status !== status) {
          setStatus(data.status);
          router.refresh(); // Refresh the page to show updated content
        }

        setPollCount(prev => prev + 1);

        // Stop polling after confirmed or 15 attempts (30 seconds)
        if (data.status === "confirmed" || data.status === "pending_code" || pollCount >= 15) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling booking status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bookingId, status, pollCount, router]);

  // Show manual refresh option after 30 seconds
  if (status === "pending" && pollCount >= 15) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-yellow-800 mb-3">
          Payment is taking longer than expected. Click below to refresh:
        </p>
        <button
          onClick={() => router.refresh()}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
        >
          Refresh Status
        </button>
      </div>
    );
  }

  return null;
}
