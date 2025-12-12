# Phase 3: Booking & Payment System - READY TO START

**Status**: Ready to begin
**Prerequisites**: ✅ Phase 1 & 2 Complete
**Estimated Duration**: 2-3 hours

---

## 🎯 Phase 3 Goals

Enable customers to:
1. Select rental dates on tool detail pages
2. See real-time availability
3. Complete guest checkout (no account required)
4. Pay via Stripe
5. Receive booking confirmation

---

## ⚠️ IMPORTANT: Read Before Starting

**MUST READ FIRST**:
- [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) - Contains critical error fixes and patterns from Phases 1 & 2

**Key Lessons to Remember**:
1. Never import Prisma in Client Components (use API routes)
2. Keep client-safe utilities in `lib/client-utils.ts`
3. Use Server Components by default, Client Components only when needed
4. Convert Prisma Decimals to numbers in data access layer
5. Implement proper webhook signature verification for Stripe

---

## 📋 Phase 3 Checklist

### 3.1 Availability Engine
- [ ] Create availability checking logic in `lib/availability.ts`
- [ ] Build availability API endpoint (`POST /api/availability`)
- [ ] Implement booking conflict detection with proper date overlap logic
- [ ] Add price calculation utility (daily rate × days + deposit)
- [ ] Test edge cases (same-day, multi-day, weekends)

### 3.2 Booking Components
- [ ] Create `DateRangePicker` component (client component)
- [ ] Create `AvailabilityCalendar` component showing blocked dates
- [ ] Build `CheckoutForm` component (name, email, phone validation)
- [ ] Create `PriceBreakdown` component (subtotal, deposit, total)
- [ ] Integrate Stripe Elements in `PaymentForm` component

### 3.3 Booking Pages
- [ ] Create booking page at `app/tools/[slug]/book/page.tsx`
- [ ] Create confirmation page at `app/booking/[id]/page.tsx`
- [ ] Add loading states throughout booking flow
- [ ] Implement error handling with user-friendly messages

### 3.4 API Routes
- [ ] `POST /api/availability` - Check if dates are available
- [ ] `POST /api/create-payment-intent` - Create Stripe PaymentIntent & pending booking
- [ ] `POST /api/bookings` - Create booking record
- [ ] `POST /api/webhooks/stripe` - Handle payment success/failure
- [ ] Implement admin role checks where needed

### 3.5 Database Operations
- [ ] Create booking CRUD functions in `lib/bookings.ts`
- [ ] Add conflict checking queries
- [ ] Implement transaction for booking creation
- [ ] Add traffic source tracking (`?source=fb&listing_id=X`)

### 3.6 Stripe Integration
- [ ] Set up Stripe Elements in checkout
- [ ] Create PaymentIntent on backend
- [ ] Handle payment confirmation on client
- [ ] Implement webhook signature verification
- [ ] Test with Stripe test cards

---

## 🏗️ File Structure to Create

```
app/
├── tools/
│   └── [slug]/
│       └── book/
│           └── page.tsx  (NEW - Booking page)
├── booking/
│   └── [id]/
│       ├── page.tsx  (NEW - Confirmation page)
│       └── not-found.tsx  (NEW)
└── api/
    ├── availability/
    │   └── route.ts  (NEW)
    ├── create-payment-intent/
    │   └── route.ts  (NEW)
    ├── bookings/
    │   └── route.ts  (NEW)
    └── webhooks/
        └── stripe/
            └── route.ts  (NEW)

components/
└── booking/
    ├── AvailabilityCalendar.tsx  (NEW - Client)
    ├── DateRangePicker.tsx  (NEW - Client)
    ├── CheckoutForm.tsx  (NEW - Client)
    ├── PaymentForm.tsx  (NEW - Client)
    └── PriceBreakdown.tsx  (NEW - Server or Client)

lib/
├── bookings.ts  (NEW - Server-side booking operations)
├── availability.ts  (NEW - Availability checking logic)
└── stripe-helpers.ts  (NEW - Stripe utility functions)
```

---

## 🔑 Critical Implementation Patterns

### 1. Booking Conflict Detection

**Pattern to Use**:
```typescript
// lib/availability.ts
export async function checkAvailability(
  toolId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  const conflicts = await prisma.booking.findMany({
    where: {
      toolId,
      status: { in: ["confirmed", "pending_code"] },
      OR: [
        // New booking starts during existing booking
        {
          rentalStartDate: { lte: startDate },
          rentalEndDate: { gte: startDate }
        },
        // New booking ends during existing booking
        {
          rentalStartDate: { lte: endDate },
          rentalEndDate: { gte: endDate }
        },
        // New booking completely contains existing booking
        {
          rentalStartDate: { gte: startDate },
          rentalEndDate: { lte: endDate }
        }
      ]
    }
  });

  return conflicts.length === 0;
}
```

### 2. Stripe PaymentIntent Flow

**Recommended Flow**:
```
1. User selects dates → Frontend validates
2. User fills checkout form → Frontend validates
3. Frontend calls POST /api/create-payment-intent
4. Backend:
   - Checks availability again (race condition prevention)
   - Creates pending booking record
   - Creates Stripe PaymentIntent
   - Returns client_secret
5. Frontend:
   - Uses Stripe Elements to collect payment
   - Confirms payment with Stripe
6. Stripe webhook:
   - Receives payment_intent.succeeded
   - Updates booking status to "confirmed"
   - Triggers email (Phase 4)
```

### 3. Guest Booking Data Model

```typescript
// When creating booking
const bookingData = {
  toolId: tool.id,
  userId: null,  // Guest booking (no user account)
  customerName: formData.name,
  customerEmail: formData.email,
  customerPhone: formData.phone,
  rentalStartDate: startDate,
  rentalEndDate: endDate,
  totalAmount: totalPrice,
  depositAmount: tool.depositAmount,
  status: "pending",
  paymentIntentId: paymentIntent.id,
  trafficSource: searchParams.source || null,
  trafficListingId: searchParams.listing_id || null
};
```

### 4. Webhook Security (CRITICAL)

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      // Update booking status to confirmed
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook error", { status: 400 });
  }
}
```

---

## 🧪 Testing Strategy

### Test Cases for Phase 3

1. **Availability Checking**
   - [ ] Book tool for dates with no conflicts → Success
   - [ ] Try to book overlapping dates → Error
   - [ ] Book same tool for different dates → Both succeed
   - [ ] Book on the same start date as another booking ends → Handle edge case

2. **Payment Flow**
   - [ ] Use test card `4242 4242 4242 4242` → Success
   - [ ] Use test card `4000 0000 0000 9995` → Decline
   - [ ] Close payment form mid-flow → Pending booking remains
   - [ ] Complete payment → Booking confirmed

3. **Guest Checkout**
   - [ ] Submit form with valid data → Success
   - [ ] Submit with invalid email → Validation error
   - [ ] Submit with missing fields → Validation error

4. **Webhook Handling**
   - [ ] Payment succeeds → Booking status updates
   - [ ] Payment fails → Booking status remains pending
   - [ ] Invalid signature → Webhook rejected

---

## 🔐 Environment Variables Needed

Add to `.env.local`:
```env
# Already configured:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# NEW - Need to configure after creating webhook:
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Getting Stripe Webhook Secret

1. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` (for local testing)
2. Or create webhook in Stripe Dashboard → Developers → Webhooks
3. Set endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select event: `payment_intent.succeeded`
5. Copy webhook signing secret

---

## 📦 New Dependencies to Install

```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
npm install date-fns  # For date calculations (optional but recommended)
npm install react-day-picker  # For calendar component (optional)
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't:
1. Trust client-side availability checks only (always verify on server)
2. Create booking before payment confirmation
3. Skip webhook signature verification
4. Use client components for Prisma queries
5. Forget to handle timezone differences in dates
6. Allow booking without checking availability again in PaymentIntent creation

### ✅ Do:
1. Check availability on both client and server
2. Create pending booking when PaymentIntent is created
3. Update booking status via webhook only
4. Use Server Components for data fetching
5. Use UTC dates consistently
6. Implement database transaction for booking creation

---

## 📊 Success Metrics for Phase 3

Phase 3 is complete when:
- [ ] Customer can select dates and see availability
- [ ] Customer can complete guest checkout form
- [ ] Payment processes successfully with Stripe test cards
- [ ] Booking is created in database with "confirmed" status
- [ ] Confirmation page shows booking details
- [ ] Webhook properly updates booking status
- [ ] Traffic source is captured from URL parameters
- [ ] Error handling works throughout the flow
- [ ] Mobile experience is responsive

---

## 🔗 Related Documentation

- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe PaymentIntents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 📝 Notes

- Payment processing is in **test mode** - use Stripe test cards
- Igloohome integration is **Phase 4** - for now, just confirm the booking
- Email notifications are **Phase 4** - no emails sent yet
- Admin booking management is **Phase 5** - basic booking creation only

---

**Ready to Start Phase 3?**

1. Read [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) thoroughly
2. Set up local Stripe CLI for webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Install new dependencies: `npm install @stripe/react-stripe-js @stripe/stripe-js`
4. Start with availability logic in `lib/availability.ts`
5. Build incrementally, testing each component

Good luck! 🚀
