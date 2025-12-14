# Stripe Webhook Setup for Vercel

## Why Payments Aren't Completing

If bookings are stuck on "Payment Pending", it's because **Stripe webhooks aren't configured**.

When a customer pays:
1. ✅ Stripe processes the payment
2. ❌ Stripe tries to notify your app via webhook (but it's not set up!)
3. ❌ Your app never receives the notification
4. ❌ Booking stays "pending" forever

## Setup Steps

### 1. Go to Stripe Dashboard
- Log in to https://dashboard.stripe.com
- Go to **Developers** → **Webhooks**

### 2. Add Endpoint
- Click **"Add endpoint"**
- Enter your Vercel URL:
  ```
  https://your-app.vercel.app/api/webhooks/stripe
  ```
- Replace `your-app.vercel.app` with your actual Vercel domain

### 3. Select Events
Select these two events:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

### 4. Get Webhook Secret
- After creating the endpoint, click on it
- Click **"Reveal"** next to "Signing secret"
- Copy the secret (starts with `whsec_...`)

### 5. Add to Vercel Environment Variables
- Go to your Vercel project
- Go to **Settings** → **Environment Variables**
- Add new variable:
  - **Name:** `STRIPE_WEBHOOK_SECRET`
  - **Value:** `whsec_...` (paste the secret you copied)
  - **Environment:** Production, Preview, Development

### 6. Redeploy
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment

## Testing

After setup:
1. Make a test booking
2. Use Stripe test card: `4242 4242 4242 4242`
3. The confirmation page should update from "Payment Pending" to "Booking Confirmed" within 2-4 seconds
4. You should receive a confirmation email

## Troubleshooting

**Still seeing "Payment Pending"?**
- Check Vercel logs for webhook errors
- Verify the webhook URL is exactly: `https://your-domain.vercel.app/api/webhooks/stripe`
- Make sure `STRIPE_WEBHOOK_SECRET` is set in Vercel
- Try redeploying after adding the environment variable

**How to check if webhooks are working:**
- Go to Stripe Dashboard → Developers → Webhooks
- Click on your endpoint
- Check the "Recent deliveries" section
- You should see successful webhook calls (200 status)
