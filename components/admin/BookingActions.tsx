"use client";

import { BookingStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
}

export default function BookingActions({
  bookingId,
  status,
}: BookingActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);

  const handleMarkComplete = async () => {
    if (!confirm("Are you sure you want to mark this booking as completed?")) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}/complete`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to mark booking as complete");
        }

        router.refresh();
      } catch (error) {
        console.error("Error marking booking as complete:", error);
        alert("Failed to mark booking as complete. Please try again.");
      }
    });
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/resend-email`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to resend confirmation email");
      }

      alert("Confirmation email resent successfully!");
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Failed to resend confirmation email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCancelBooking = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to cancel booking");
        }

        router.refresh();
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Mark as Complete - Only show if confirmed */}
      {status === "confirmed" && (
        <button
          onClick={handleMarkComplete}
          disabled={isPending}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isPending ? "Processing..." : "Mark as Completed"}
        </button>
      )}

      {/* Resend Email - Only show if confirmed */}
      {status === "confirmed" && (
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isResending ? "Sending..." : "Resend Confirmation Email"}
        </button>
      )}

      {/* Cancel Booking - Show if not already cancelled or completed */}
      {status !== "cancelled" && status !== "completed" && (
        <button
          onClick={handleCancelBooking}
          disabled={isPending}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isPending ? "Processing..." : "Cancel Booking"}
        </button>
      )}

      {/* View Customer Email */}
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
        <div className="space-y-2">
          <a
            href={`mailto:?subject=Regarding Your Tool Rental Booking ${bookingId.slice(0, 8)}`}
            className="text-sm text-blue-600 hover:text-blue-800 block"
          >
            Send Custom Email
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(bookingId)}
            className="text-sm text-gray-600 hover:text-gray-800 block"
          >
            Copy Booking ID
          </button>
        </div>
      </div>
    </div>
  );
}
