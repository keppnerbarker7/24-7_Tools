import Stripe from "stripe";

let stripe: Stripe | null = null;

const mockPayments = process.env.MOCK_PAYMENTS === "true";

function getStripe() {
  if (mockPayments) return null;
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
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
    automatic_payment_methods: {
      enabled: true,
    },
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
