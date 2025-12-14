import Stripe from "stripe";

let stripe: Stripe | null = null;

const mockPayments = process.env.MOCK_PAYMENTS === "true";

function getStripe() {
  if (mockPayments) {
    console.log("⚠️ MOCK_PAYMENTS is enabled, Stripe disabled");
    return null;
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is not set in environment variables");
    return null;
  }
  if (!stripe) {
    console.log("✅ Initializing Stripe with key:", process.env.STRIPE_SECRET_KEY?.substring(0, 7) + "...");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
    });
  }
  return stripe;
}

/**
 * Create a Stripe PaymentIntent
 */
export async function createPaymentIntent(
  amount: number,
  metadata: {
    toolId: string;
    toolName: string;
    customerName: string;
    customerEmail: string;
    rentalStartDate: string;
    rentalEndDate: string;
  }
): Promise<Stripe.PaymentIntent> {
  const client = getStripe();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  const paymentIntent = await client.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: "usd",
    metadata,
    payment_method_types: ["card"], // Only enable card payments
  });

  return paymentIntent;
}

/**
 * Retrieve a PaymentIntent by ID
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const client = getStripe();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  return await client.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  const client = getStripe();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  return client.webhooks.constructEvent(payload, signature, secret);
}
