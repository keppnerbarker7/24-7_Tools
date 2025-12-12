import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe-helpers";
import { getBookingByPaymentIntentId, updateBookingStatus, updateBookingAccessCode } from "@/lib/bookings";
import { createAccessCode } from "@/lib/igloohome";
import { sendBookingConfirmation } from "@/lib/emails/send-booking-confirmation";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    // Temporarily hardcode webhook secret for testing
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_208ac1da2d972049beb878bc25e09353dcaa114e1642f0a31bbb941aeabd9f5f";

    console.log("Using webhook secret:", webhookSecret ? "PRESENT" : "MISSING");

    // Verify webhook signature
    const event = verifyWebhookSignature(
      body,
      signature,
      webhookSecret
    );

    console.log(`Received webhook event: ${event.type}`);

    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

      // Find the booking by payment intent ID
      const booking = await getBookingByPaymentIntentId(paymentIntent.id);

      if (!booking) {
        console.error(`No booking found for PaymentIntent: ${paymentIntent.id}`);
        // Ack to Stripe to avoid retries but log for ops
        return NextResponse.json({ received: true });
      }

      try {
        // Ensure tool is loaded
        if (!booking.tool) {
          console.error(`Tool not loaded for booking ${booking.id}`);
          await updateBookingStatus(booking.id, "pending_code");
          return NextResponse.json({ received: true });
        }

        // Generate access code
        console.log(`Generating access code for booking ${booking.id}...`);
        const accessCode = await createAccessCode(
          booking.id,
          booking.rentalStartDate,
          booking.rentalEndDate
        );

        // Update booking with access code and set status to confirmed
        await updateBookingAccessCode(booking.id, accessCode);
        await updateBookingStatus(booking.id, "confirmed");
        console.log(`✅ Booking ${booking.id} confirmed with access code`);

        // Send confirmation email
        console.log(`Sending confirmation email to ${booking.customerEmail}...`);
        await sendBookingConfirmation({
          to: booking.customerEmail,
          customerName: booking.customerName,
          toolName: booking.tool.name,
          rentalStartDate: booking.rentalStartDate,
          rentalEndDate: booking.rentalEndDate,
          accessCode,
          totalAmount: Number(booking.totalAmount),
          rentalFee: Number(booking.rentalFee),
          depositAmount: Number(booking.depositAmount),
          bookingId: booking.id,
        });
        console.log(`✅ Confirmation email sent to ${booking.customerEmail}`);
      } catch (error) {
        console.error(`❌ Error processing booking ${booking.id}:`, error);
        // Mark as pending_code so operations can retry manually
        await updateBookingStatus(booking.id, "pending_code");
      }
    }

    // Handle payment_intent.payment_failed event
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent failed: ${paymentIntent.id}`);

      const booking = await getBookingByPaymentIntentId(paymentIntent.id);

      if (booking) {
        await updateBookingStatus(booking.id, "failed");
        console.log(`Booking ${booking.id} status updated to failed`);
      } else {
        console.error(`No booking found for failed PaymentIntent: ${paymentIntent.id}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
