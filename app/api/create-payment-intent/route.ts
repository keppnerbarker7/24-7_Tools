import { NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/stripe-helpers";
import { checkAvailability, calculateRentalPrice } from "@/lib/availability";
import { createBooking, updateBookingAccessCode, updateBookingPaymentIntent } from "@/lib/bookings";
import { getToolBySlug } from "@/lib/tools";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📝 CREATE PAYMENT INTENT - Request received:", {
      toolSlug: body.toolSlug,
      customerEmail: body.customerEmail,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    const {
      toolSlug,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      trafficSource,
      trafficListingId,
    } = body;

    // Validate required fields
    if (!toolSlug || !customerName || !customerEmail || !customerPhone || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get tool details
    const tool = await getToolBySlug(toolSlug);
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        { error: "End date cannot be before start date" },
        { status: 400 }
      );
    }

    if (start < new Date()) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      );
    }

    // Check availability (race condition prevention)
    const isAvailable = await checkAvailability(tool.id, start, end);
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Tool is not available for the selected dates" },
        { status: 409 }
      );
    }

    // Calculate price
    const pricing = calculateRentalPrice(
      tool.dailyRate,
      tool.depositAmount,
      start,
      end
    );

    const mockPayments = process.env.MOCK_PAYMENTS === "true" || !process.env.STRIPE_SECRET_KEY;

    // Create booking record first (pending unless mock)
    const booking = await createBooking({
      toolId: tool.id,
      userId: null, // Guest booking
      customerName,
      customerEmail,
      customerPhone,
      rentalStartDate: start,
      rentalEndDate: end,
      totalAmount: pricing.total,
      rentalFee: pricing.subtotal,
      depositAmount: pricing.deposit,
      status: mockPayments ? "confirmed" : "pending",
      paymentIntentId: mockPayments ? "pi_mock" : undefined,
      trafficSource,
      fbListingId: trafficListingId,
    });

    if (mockPayments) {
      // Bypass Stripe for local/demo, attach a placeholder access code
      await updateBookingAccessCode(booking.id, "MOCK-CODE");
      return NextResponse.json({
        mock: true,
        bookingId: booking.id,
        clientSecret: null,
        pricing,
        accessCode: "MOCK-CODE",
      });
    }

    // Create Stripe PaymentIntent
    console.log("💳 Creating Stripe PaymentIntent for amount:", pricing.total);
    const paymentIntent = await createPaymentIntent(pricing.total, {
      toolId: tool.id,
      toolName: tool.name,
      customerName,
      customerEmail,
      rentalStartDate: start.toISOString(),
      rentalEndDate: end.toISOString(),
    });

    console.log("✅ PaymentIntent created:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    });

    // Persist PaymentIntent ID on booking
    await updateBookingPaymentIntent(booking.id, paymentIntent.id);
    console.log("✅ PaymentIntent ID saved to booking:", booking.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
      pricing,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
