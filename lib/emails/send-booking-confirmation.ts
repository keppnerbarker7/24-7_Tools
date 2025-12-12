import { resend } from "../resend";
import { BookingConfirmationEmail } from "./booking-confirmation";

interface SendBookingConfirmationParams {
  to: string;
  customerName: string;
  toolName: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  accessCode: string;
  totalAmount: number;
  rentalFee: number;
  depositAmount: number;
  bookingId: string;
}

export async function sendBookingConfirmation(params: SendBookingConfirmationParams) {
  const {
    to,
    customerName,
    toolName,
    rentalStartDate,
    rentalEndDate,
    accessCode,
    totalAmount,
    rentalFee,
    depositAmount,
    bookingId,
  } = params;

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const emailHtml = BookingConfirmationEmail({
      customerName,
      toolName,
      rentalStartDate,
      rentalEndDate,
      accessCode,
      totalAmount,
      rentalFee,
      depositAmount,
      bookingId,
    });

    const data = await resend.emails.send({
      from,
      to,
      subject: `Booking Confirmed: ${toolName} - Utah Valley Tool Rental`,
      html: emailHtml,
    });

    console.log(`✅ Booking confirmation email sent to ${to}`, { emailId: data.id });
    return data;
  } catch (error) {
    console.error("❌ Failed to send booking confirmation email:", error);
    throw error;
  }
}
