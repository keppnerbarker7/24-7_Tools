import { format } from "date-fns";

interface BookingConfirmationEmailProps {
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

export const BookingConfirmationEmail = ({
  customerName,
  toolName,
  rentalStartDate,
  rentalEndDate,
  accessCode,
  totalAmount,
  rentalFee,
  depositAmount,
  bookingId,
}: BookingConfirmationEmailProps) => {
  const startDateStr = format(rentalStartDate, "MMMM d, yyyy 'at' h:mm a");
  const endDateStr = format(rentalEndDate, "MMMM d, yyyy 'at' h:mm a");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Utah Valley Tool Rental</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Booking Confirmed! 🎉
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px;">
              <p style="margin: 0; font-size: 16px; color: #111827; line-height: 1.5;">
                Hi ${customerName},
              </p>
              <p style="margin: 16px 0 0; font-size: 16px; color: #111827; line-height: 1.5;">
                Great news! Your tool rental has been confirmed. Here are your booking details:
              </p>
            </td>
          </tr>

          <!-- Tool Name -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                  Tool
                </p>
                <p style="margin: 8px 0 0; font-size: 20px; color: #111827; font-weight: 700;">
                  ${toolName}
                </p>
              </div>
            </td>
          </tr>

          <!-- Access Code -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #f0fdf4; border: 2px dashed #10b981; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Your Access Code
                </p>
                <p style="margin: 12px 0 0; font-size: 36px; color: #047857; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${accessCode}
                </p>
                <p style="margin: 8px 0 0; font-size: 13px; color: #059669;">
                  Use this code to unlock the tool storage
                </p>
              </div>
            </td>
          </tr>

          <!-- Rental Dates -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px; background-color: #f9fafb; border-radius: 6px;">
                    <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 600;">
                      📅 Rental Start
                    </p>
                    <p style="margin: 6px 0 0; font-size: 15px; color: #111827; font-weight: 500;">
                      ${startDateStr}
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #f9fafb; border-radius: 6px;">
                    <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 600;">
                      📅 Rental End
                    </p>
                    <p style="margin: 6px 0 0; font-size: 15px; color: #111827; font-weight: 500;">
                      ${endDateStr}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Summary -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Payment Summary
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 15px; color: #111827;">
                      Rental Fee
                    </td>
                    <td align="right" style="padding: 6px 0; font-size: 15px; color: #111827; font-weight: 500;">
                      $${(rentalFee / 100).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 15px; color: #111827;">
                      Security Deposit
                    </td>
                    <td align="right" style="padding: 6px 0; font-size: 15px; color: #111827; font-weight: 500;">
                      $${(depositAmount / 100).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 12px 0 6px; border-top: 2px solid #e5e7eb;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 16px; color: #111827; font-weight: 700;">
                      Total Paid
                    </td>
                    <td align="right" style="padding: 6px 0; font-size: 18px; color: #2563eb; font-weight: 700;">
                      $${(totalAmount / 100).toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Important Info -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
                  ⚠️ Important Information
                </p>
                <ul style="margin: 12px 0 0; padding-left: 20px; font-size: 14px; color: #78350f; line-height: 1.6;">
                  <li style="margin-bottom: 8px;">Your access code is valid only during your rental period</li>
                  <li style="margin-bottom: 8px;">The security deposit will be refunded within 5-7 business days after you return the tool</li>
                  <li style="margin-bottom: 8px;">Please return the tool in the same condition you received it</li>
                  <li>Late returns may result in additional charges</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Booking Reference -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <p style="margin: 0; font-size: 13px; color: #6b7280; text-align: center;">
                Booking Reference: <span style="font-family: 'Courier New', monospace; color: #111827; font-weight: 600;">${bookingId}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #111827; font-weight: 600;">
                Need Help?
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                If you have any questions about your booking, please don't hesitate to contact us.
              </p>
              <p style="margin: 16px 0 0; font-size: 13px; color: #9ca3af; text-align: center;">
                © ${new Date().getFullYear()} Utah Valley Tool Rental. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
