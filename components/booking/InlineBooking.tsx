"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DateRangePicker from "@/components/booking/DateRangePicker";
import CheckoutForm from "@/components/booking/CheckoutForm";
import PaymentForm from "@/components/booking/PaymentForm";
import PriceBreakdown from "@/components/booking/PriceBreakdown";
import { calculateRentalPrice } from "@/lib/client-utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface InlineBookingProps {
  tool: {
    id: string;
    slug: string;
    name: string;
    dailyRate: number;
    depositAmount: number;
    category: {
      name: string;
    };
  };
  trafficSource?: string | null;
  trafficListingId?: string | null;
}

export default function InlineBooking({
  tool,
  trafficSource,
  trafficListingId,
}: InlineBookingProps) {
  const [bookedDates, setBookedDates] = useState<
    Array<{ start: Date; end: Date }>
  >([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [step, setStep] = useState<"dates" | "checkout" | "payment">("dates");
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [mockBooking, setMockBooking] = useState<{ accessCode: string } | null>(null);

  // Load booked dates once for the tool
  useEffect(() => {
    const loadBookedDates = async () => {
      try {
        const response = await fetch("/api/availability/booked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: tool.id }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("Failed to load booked dates", data?.error);
          return;
        }

        const normalized = (data.bookedDates || []).map((range: { start: string; end: string }) => ({
          start: new Date(range.start),
          end: new Date(range.end),
        }));
        setBookedDates(normalized);
      } catch (err) {
        console.error("Error loading booked dates:", err);
      }
    };

    loadBookedDates();
  }, [tool.id]);

  // Check availability when dates change
  useEffect(() => {
    if (startDate && endDate && tool) {
      checkAvailability();
    }
  }, [startDate, endDate, tool]);

  const checkAvailability = async () => {
    if (!startDate || !endDate || !tool) return;

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to check availability");
        setIsAvailable(false);
        return;
      }

      setIsAvailable(data.available);

      if (data.available) {
        // Calculate pricing
        const priceCalc = calculateRentalPrice(
          tool.dailyRate,
          tool.depositAmount,
          startDate,
          endDate
        );
        setPricing(priceCalc);
        setError(null);
      } else {
        setError("Tool is not available for the selected dates");
        setPricing(null);
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setError("Failed to check availability");
      setIsAvailable(false);
    }
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    setPricing(null);
    setIsAvailable(null);
    setError(null);
  };

  const handleContinueToCheckout = () => {
    if (isAvailable && pricing) {
      setStep("checkout");
      // Scroll to form
      setTimeout(() => {
        document.getElementById("booking-form")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleCheckoutSubmit = async (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => {
    setCustomerInfo(data);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: tool.slug,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          trafficSource,
          trafficListingId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create payment intent");
      }

      // Mock mode: booking already confirmed
      if (result.mock) {
        setMockBooking({ accessCode: result.accessCode || "MOCK-CODE" });
        setBookingId(result.bookingId);
        setStep("payment");
        return;
      }

      setClientSecret(result.clientSecret);
      setBookingId(result.bookingId);
      setStep("payment");

      // Scroll to payment form
      setTimeout(() => {
        document.getElementById("booking-form")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: any) {
      console.error("Error creating payment intent:", err);
      setError(err.message || "Failed to process booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="booking-form" className="relative bg-white/5 rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.35)] p-6 lg:p-8 border border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%)" }} />
      <div className="relative space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">
            Reserve Now
          </h2>
          <p className="text-white/70 text-sm">
            Pick your dates - instant confirmation
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-white/60 uppercase tracking-[0.18em]">
          {["Select dates", "Your info", "Payment"].map((label, idx) => {
            const active = step === "dates" ? idx === 0 : step === "checkout" ? idx <= 1 : idx <= 2;
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`h-7 w-7 grid place-items-center rounded-full border text-[11px] ${
                    active ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 border-transparent" : "border-white/20 text-white/50"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className={active ? "text-white" : ""}>{label}</span>
                {idx < 2 && <span className="h-px w-8 bg-white/20" />}
              </div>
            );
          })}
        </div>

        {pricing && isAvailable && (
          <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">Rental cost</span>
              <span className="text-2xl font-black text-white">
                ${pricing.subtotal.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>{pricing.days} {pricing.days === 1 ? 'day' : 'days'} × ${tool.dailyRate.toFixed(0)}/day</span>
              <span className="text-xs">+ ${tool.depositAmount.toFixed(0)} deposit</span>
            </div>
          </div>
        )}

        {/* Step 1: Select Dates */}
      {step === "dates" && (
        <div className="space-y-6">
          <DateRangePicker
            onDateChange={handleDateChange}
            bookedDates={bookedDates}
          />

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/40 rounded-lg">
                <p className="text-sm text-red-100 font-medium">{error}</p>
              </div>
            )}

            {pricing && isAvailable && (
              <>
                <PriceBreakdown
                  dailyRate={tool.dailyRate}
                  days={pricing.days}
                  subtotal={pricing.subtotal}
                  deposit={pricing.deposit}
                  total={pricing.total}
                />

                <button
                  onClick={handleContinueToCheckout}
                  className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 py-4 px-6 rounded-xl font-black hover:-translate-y-0.5 transition-all shadow-[0_14px_40px_rgba(255,106,26,0.35)]"
                >
                  Continue to Checkout →
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2: Customer Information */}
        {step === "checkout" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Your Information
              </h3>
              <p className="text-sm text-white/70">
                We&apos;ll send your access code to this email
              </p>
            </div>

            {pricing && (
              <PriceBreakdown
                dailyRate={tool.dailyRate}
                days={pricing.days}
                subtotal={pricing.subtotal}
                deposit={pricing.deposit}
                total={pricing.total}
              />
            )}

            <CheckoutForm onSubmit={handleCheckoutSubmit} isLoading={isLoading} />

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/40 rounded-lg">
                <p className="text-sm text-red-100 font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

      {/* Step 3: Payment */}
      {step === "payment" && mockBooking && bookingId && (
        <div className="space-y-4 rounded-2xl border border-emerald-300/40 bg-emerald-900/10 p-4">
          <div className="flex items-center gap-2 text-emerald-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Booking confirmed (test mode)</span>
          </div>
          <div className="text-sm text-emerald-100">
            Access code: <span className="font-bold">{mockBooking.accessCode}</span>
          </div>
          <p className="text-xs text-emerald-200">
            Stripe is mocked in this environment. Set REAL keys + disable MOCK_PAYMENTS to enable live checkout.
          </p>
        </div>
      )}

      {step === "payment" && clientSecret && bookingId && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Complete Payment
            </h3>
              <p className="text-sm text-white/70">
                Secure payment powered by Stripe
              </p>
            </div>

            {pricing && (
              <PriceBreakdown
                dailyRate={tool.dailyRate}
                days={pricing.days}
                subtotal={pricing.subtotal}
                deposit={pricing.deposit}
                total={pricing.total}
              />
            )}

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm bookingId={bookingId} totalAmount={pricing.total} />
            </Elements>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-3 text-xs text-white/70">
          {[
            "Secure Stripe checkout",
            "Cancel free up to 12h",
            "Refundable deposit",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold text-center">
              {item}
            </div>
          ))}
        </div>
      </div>

      {pricing && isAvailable && step === "dates" && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={handleContinueToCheckout}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-amber)] text-slate-900 py-4 px-6 rounded-2xl font-black shadow-[0_18px_50px_rgba(255,106,26,0.45)]"
          >
            Reserve for ${pricing.total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
