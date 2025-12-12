"use client";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Find the max revenue to scale the bars
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  // If no data, show empty state
  if (data.length === 0 || maxRevenue === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm">No revenue data available yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Revenue will appear as bookings are confirmed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-64">
        {data.map((item, index) => {
          const heightPercentage = (item.revenue / maxRevenue) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              {/* Bar */}
              <div className="w-full flex flex-col justify-end h-full">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative group"
                  style={{ height: `${heightPercentage}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      ${item.revenue.toFixed(2)}
                    </div>
                    <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1"></div>
                  </div>
                </div>
              </div>
              {/* Month Label */}
              <div className="text-xs text-gray-600 font-medium text-center">
                {item.month}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-xs text-gray-600">Monthly Revenue</span>
        </div>
        <div className="text-xs text-gray-500">
          Peak: ${maxRevenue.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
