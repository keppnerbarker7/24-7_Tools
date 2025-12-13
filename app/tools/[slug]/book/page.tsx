"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
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

export default function BookToolPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tool, setTool] = useState<any>(null);
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

  // Get traffic source from URL params
  const trafficSource = searchParams.get("source");
  const trafficListingId = searchParams.get("listing_id");

  // Fetch tool details
  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`/api/tools?slug=${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tool");
        }
        const data = await response.json();
        setTool(data);

        // Fetch booked dates (placeholder for now)
        // In a real implementation, you'd fetch this from an API
        setBookedDates([]);
      } catch (err) {
        console.error("Error fetching tool:", err);
        setError("Failed to load tool information");
      }
    };

    fetchTool();
  }, [slug]);

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
          toolSlug: slug,
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

      setClientSecret(result.clientSecret);
      setBookingId(result.bookingId);
      setStep("payment");
    } catch (err: any) {
      console.error("Error creating payment intent:", err);
      setError(err.message || "Failed to process booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Tool
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book {tool.name}</h1>
          <p className="text-gray-600 mt-1">{tool.category.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div
            className={`flex items-center ${
              step === "dates" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === "dates"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              1
            </div>
            <span className="ml-2 font-medium">Dates</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div
            className={`flex items-center ${
              step === "checkout" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === "checkout"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Details</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div
            className={`flex items-center ${
              step === "payment" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === "payment"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              3
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Select Dates */}
          {step === "dates" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Select Rental Dates
              </h2>

              <DateRangePicker
                onDateChange={handleDateChange}
                bookedDates={bookedDates}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
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
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Checkout
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 2: Customer Information */}
          {step === "checkout" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Information
              </h2>

              {pricing && (
                <PriceBreakdown
                  dailyRate={tool.dailyRate}
                  days={pricing.days}
                  subtotal={pricing.subtotal}
                  deposit={pricing.deposit}
                  total={pricing.total}
                />
              )}

              <CheckoutForm
                onSubmit={handleCheckoutSubmit}
                isLoading={isLoading}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={() => setStep("dates")}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Change Dates
              </button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && clientSecret && bookingId && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Complete Payment
              </h2>

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
                <PaymentForm
                  bookingId={bookingId}
                  totalAmount={pricing.total}
                />
              </Elements>

              <button
                onClick={() => setStep("checkout")}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
