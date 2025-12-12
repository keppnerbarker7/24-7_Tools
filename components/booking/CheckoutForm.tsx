"use client";

import { useState } from "react";

interface CheckoutFormProps {
  onSubmit: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => void;
  isLoading?: boolean;
}

export default function CheckoutForm({
  onSubmit,
  isLoading = false,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [errors, setErrors] = useState<{
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: typeof errors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!validatePhone(formData.customerPhone)) {
      newErrors.customerPhone = "Invalid phone number format (e.g., 555-123-4567)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.customerName ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
          required
        />
        {errors.customerName && (
          <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="customerEmail"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="customerEmail"
          value={formData.customerEmail}
          onChange={(e) => handleChange("customerEmail", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.customerEmail ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
          required
        />
        {errors.customerEmail && (
          <p className="text-sm text-red-600 mt-1">{errors.customerEmail}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="customerPhone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number *
        </label>
        <input
          type="tel"
          id="customerPhone"
          value={formData.customerPhone}
          onChange={(e) => handleChange("customerPhone", e.target.value)}
          placeholder="555-123-4567"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.customerPhone ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
          required
        />
        {errors.customerPhone && (
          <p className="text-sm text-red-600 mt-1">{errors.customerPhone}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );
}
