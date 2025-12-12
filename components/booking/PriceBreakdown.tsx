interface PriceBreakdownProps {
  dailyRate: number;
  days: number;
  subtotal: number;
  deposit: number;
  total: number;
}

export default function PriceBreakdown({
  dailyRate,
  days,
  subtotal,
  deposit,
  total,
}: PriceBreakdownProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>

      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Daily Rate × {days} {days === 1 ? "day" : "days"}
        </span>
        <span>${dailyRate.toFixed(2)} × {days}</span>
      </div>

      <div className="flex justify-between text-sm font-medium text-gray-900">
        <span>Rental Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Security Deposit</span>
        <span>${deposit.toFixed(2)}</span>
      </div>

      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        * Security deposit will be refunded after the rental period ends and the
        tool is returned in good condition.
      </p>
    </div>
  );
}
