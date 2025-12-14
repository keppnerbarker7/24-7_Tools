"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface PaymentFormProps {
  bookingId: string;
  totalAmount: number;
}

export default function PaymentForm({
  bookingId,
  totalAmount,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("💳 Payment form submitted for booking:", bookingId);

    if (!stripe || !elements) {
      console.error("❌ Stripe or Elements not loaded");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      console.log("🔄 Confirming payment with Stripe...");
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/${bookingId}`,
        },
      });

      if (error) {
        console.error("❌ Payment error:", error);
        setErrorMessage(error.message || "An error occurred during payment");
        setIsProcessing(false);
      } else {
        console.log("✅ Payment confirmed, redirecting...");
      }
    } catch (err) {
      console.error("❌ Unexpected payment error:", err);
      setErrorMessage("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Information
        </h3>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card information.
      </p>
    </form>
  );
}
