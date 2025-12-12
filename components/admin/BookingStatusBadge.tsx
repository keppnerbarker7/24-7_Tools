import { BookingStatus } from "@prisma/client";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export default function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps) {
  const statusConfig: Record<
    BookingStatus,
    { label: string; className: string }
  > = {
    pending: {
      label: "Pending Payment",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    pending_code: {
      label: "Pending Access Code",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    completed: {
      label: "Completed",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
