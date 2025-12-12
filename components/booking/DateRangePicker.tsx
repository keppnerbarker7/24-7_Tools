"use client";

import { useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
} from "date-fns";

interface DateRangePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  bookedDates?: Array<{ start: Date; end: Date }>;
}

export default function DateRangePicker({
  onDateChange,
  bookedDates = [],
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingEndDate, setSelectingEndDate] = useState(false);

  const today = startOfDay(new Date());
  const nextMonth = addMonths(currentMonth, 1);

  const isDateBooked = (date: Date) => {
    return bookedDates.some((booking) => {
      const bookStart = startOfDay(new Date(booking.start));
      const bookEnd = startOfDay(new Date(booking.end));
      return date >= bookStart && date <= bookEnd;
    });
  };

  const isBlocked = (date: Date) => isBefore(date, today) || isDateBooked(date);

  const isRangeAvailable = (start: Date, end: Date) => {
    const days = eachDayOfInterval({ start, end });
    return days.every((day) => !isBlocked(day));
  };

  const findNextAvailableRange = (length: number) => {
    for (let i = 0; i < 90; i++) {
      const start = addDays(today, i);
      const end = addDays(start, length - 1);
      if (isRangeAvailable(start, end)) return { start, end };
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    if (!selectingEndDate) {
      setStartDate(date);
      setEndDate(null);
      setSelectingEndDate(true);
      onDateChange(date, null);
      return;
    }

    if (startDate && isBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null);
      onDateChange(date, null);
      return;
    }

    setEndDate(date);
    setSelectingEndDate(false);
    onDateChange(startDate, date);
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const quickPick = (length: number) => {
    const slot = findNextAvailableRange(length);
    if (!slot) return null;
    return {
      label: `${length} day${length > 1 ? "s" : ""} • ${format(slot.start, "MMM d")} - ${format(slot.end, "MMM d")}`,
      start: slot.start,
      end: slot.end,
    };
  };

  const quickOptions = [1, 2, 3].map(quickPick).filter(Boolean) as Array<{
    label: string;
    start: Date;
    end: Date;
  }>;

  return (
    <div className="space-y-5 text-white">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-40"
            disabled={isSameMonth(currentMonth, today)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-black">{format(currentMonth, "MMMM yyyy")}</h3>
          <p className="text-xs text-white/60">{format(nextMonth, "MMMM yyyy")} next</p>
        </div>
      </div>

      {/* Quick picks */}
      {quickOptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                setStartDate(opt.start);
                setEndDate(opt.end);
                setSelectingEndDate(false);
                onDateChange(opt.start, opt.end);
              }}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
            >
              <div className="font-semibold text-white">{opt.label}</div>
              <div className="text-xs text-white/60">Next open slot</div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Dates Display */}
      {(startDate || endDate) && (
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {startDate ? format(startDate, "MMM d, yyyy") : "Select start"}
              {endDate && ` → ${format(endDate, "MMM d, yyyy")}`}
            </p>
            <p className="text-xs text-white/60">
              {selectingEndDate
                ? "Select end date"
                : endDate && startDate
                ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days`
                : "Select a range"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setSelectingEndDate(false);
              onDateChange(null, null);
            }}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-white/60 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square p-1 bg-white/5"></div>
          ))}
          {daysInMonth.map((date) => {
            const booked = isDateBooked(date);
            const inRange = isDateInRange(date);
            const isStart = startDate && isSameDay(date, startDate);
            const isEnd = endDate && isSameDay(date, endDate);
            const isTodayDate = isToday(date);
            const disabled = isBlocked(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => !disabled && handleDateClick(date)}
                disabled={disabled}
                className={`
                  aspect-square p-1 border-r border-b border-white/5 text-sm transition-all relative
                  ${disabled ? "bg-white/5 text-white/30 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}
                  ${inRange && !disabled ? "bg-[rgba(255,106,26,0.12)]" : ""}
                  ${isStart || isEnd ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 font-black" : ""}
                  ${isTodayDate && !isStart && !isEnd ? "outline outline-1 outline-[var(--accent)]" : ""}
                `}
              >
                {format(date, "d")}
                {booked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-white/70">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[rgba(255,106,26,0.12)] rounded border border-white/10"></div>
          <span>In range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white/5 rounded border border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          </div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white/5 rounded border border-white/10"></div>
          <span>Unavailable (past)</span>
        </div>
      </div>
    </div>
  );
}
