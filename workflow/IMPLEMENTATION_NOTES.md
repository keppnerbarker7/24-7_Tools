# Implementation Notes & Critical Lessons Learned

**Last Updated**: December 9, 2025
**Covers**: Phase 1 & Phase 2 Implementation

---

## Overview

This document captures critical errors, fixes, architectural decisions, and lessons learned during Phases 1 and 2. **Read this before starting Phase 3** to avoid repeating mistakes and understand key implementation patterns.

---

## Table of Contents

1. [Critical Errors & Fixes](#critical-errors--fixes)
2. [Architectural Decisions](#architectural-decisions)
3. [Authentication Architecture](#authentication-architecture)
4. [Client vs Server Component Boundaries](#client-vs-server-component-boundaries)
5. [Database & Prisma Best Practices](#database--prisma-best-practices)
6. [Environment Configuration](#environment-configuration)
7. [Next Steps for Phase 3](#next-steps-for-phase-3)

---

## Critical Errors & Fixes

### 1. Tailwind CSS PostCSS Plugin Error ❌ → ✅

**Error**:
```
It looks like you're trying to use 'tailwindcss' directly as a PostCSS plugin
```

**Root Cause**: Tailwind CSS v4 requires `@tailwindcss/postcss` instead of the old `tailwindcss` plugin.

**Fix**:
```bash
npm install @tailwindcss/postcss
```

Updated [postcss.config.mjs](../postcss.config.mjs):
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},  // NOT 'tailwindcss'
  },
};
```

**Lesson**: Always check package documentation for breaking changes in major version updates.

---

### 2. LoginForm Import Typo ❌ → ✅

**Error**:
```
Module not found: Can't resolve 'use'
```

**Root Cause**: Typo in import statement.

**Bad Code**:
```typescript
import { useState } from "use"  // ❌ WRONG
```

**Fixed Code**:
```typescript
import { useState } from "react"  // ✅ CORRECT
```

**Lesson**: Simple typos can cause confusing error messages. Always double-check imports.

---

### 3. Admin Login Redirect Loop ❌ → ✅

**Error**:
```
localhost redirected you too many times
```

**Root Cause**:
- Login page was at `/admin/login`
- `/admin` directory used a protected layout that checked authentication
- If not authenticated, layout redirected to `/admin/login`
- But `/admin/login` was INSIDE `/admin`, so it also went through the protected layout
- This created an infinite redirect loop

**Initial Bad Architecture**:
```
app/
└── admin/
    ├── layout.tsx (protected - redirects if not authenticated)
    ├── page.tsx
    └── login/
        └── page.tsx  // ❌ WRONG - inside protected area
```

**User's Better Suggestion**:
> "Would it be possible to just have one log in page accessible to everyone and have the admin info button only show up if you have admin permissions?"

**Fixed Architecture**:
```
app/
├── login/
│   └── page.tsx  // ✅ CORRECT - public route, role-based redirect after login
└── admin/
    ├── layout.tsx (protected - redirects to /login)
    └── page.tsx
```

**Implementation**:

[app/login/page.tsx](../app/login/page.tsx):
```typescript
export default async function LoginPage() {
  const user = await getCurrentUser();

  // If already logged in, redirect based on role
  if (user) {
    if (user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/account");
    }
  }

  return <LoginForm />;
}
```

[components/auth/LoginForm.tsx](../components/auth/LoginForm.tsx):
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // ... sign in with Supabase

  // Fetch user with role from API
  const response = await fetch("/api/auth/user");
  const userData = await response.json();

  // Redirect based on role
  if (userData.user.role === "admin") {
    router.push("/admin");
  } else {
    router.push("/account");
  }
};
```

**Lesson**:
- Never put authentication pages inside protected route directories
- Use role-based redirects for shared login pages
- Think through the redirect flow carefully before implementing

---

### 4. Supabase Auth vs Database Confusion ❌ → ✅

**User Question**:
> "I'm trying to sign in but I don't have a password. I think that needs to be added as a column to the database, does it not?"

**Explanation Given**:
- Supabase uses **two separate systems**:
  1. **Supabase Auth**: Stores authentication credentials (email, password hashes, sessions)
  2. **Your Database**: Stores user profile data (id, email, role, etc.)

**Architecture**:
```
┌─────────────────────┐
│  Supabase Auth      │  ← Passwords stored here
│  (auth.users)       │  ← Managed by Supabase
└─────────────────────┘
          ↓
    User signs in
          ↓
┌─────────────────────┐
│  Your Database      │  ← User profile data
│  (public.users)     │  ← You manage this
│  - id (from Auth)   │
│  - email            │
│  - role             │
└─────────────────────┘
```

**Correct Workflow**:

1. **Create user in Supabase Auth Dashboard**:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Enter email and password
   - Copy the UUID

2. **Add user record to database**:
```sql
INSERT INTO users (id, email, role, created_at, updated_at)
VALUES (
  'UUID-FROM-SUPABASE-AUTH',
  'user@example.com',
  'admin',
  NOW(),
  NOW()
);
```

**Alternative**: Use `ON CONFLICT` to update existing users:
```sql
INSERT INTO users (id, email, role, created_at, updated_at)
VALUES (
  'UUID-FROM-SUPABASE-AUTH',
  'user@example.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

**Lesson**:
- Always understand the separation between auth provider and application database
- Document the user creation process clearly for team members
- Consider building an admin user creation flow in Phase 5

---

### 5. Prisma Client-Side Import Error (fs module) ❌ → ✅

**Error**:
```
Module not found: Can't resolve 'fs'
```

**Root Cause**:
- `ToolForm.tsx` is a **Client Component** (uses `useState`, `useRouter`)
- It imported `generateSlug` from `lib/tools.ts`
- `lib/tools.ts` imports Prisma client
- Prisma uses the `pg` adapter which requires Node.js `fs` module
- Client components can't use Node.js modules

**Bad Code Flow**:
```typescript
// components/admin/ToolForm.tsx (Client Component)
"use client";
import { generateSlug } from "@/lib/tools";  // ❌ WRONG

// lib/tools.ts (Server-side only)
import { prisma } from "@/lib/prisma";  // Uses 'pg' adapter → needs 'fs'
export function generateSlug(name: string) { ... }
```

**Fix**: Create client-safe utilities

Created [lib/client-utils.ts](../lib/client-utils.ts):
```typescript
// Pure utility functions safe for client components
// NO Prisma imports, NO Node.js modules

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
```

Fixed [components/admin/ToolForm.tsx](../components/admin/ToolForm.tsx):
```typescript
"use client";
import { generateSlug } from "@/lib/client-utils";  // ✅ CORRECT
```

**Lesson**:
- Never import Prisma (or any Node.js modules) in Client Components
- Create separate utility files for client-safe functions
- Keep `lib/tools.ts` for server-side database operations only
- When you see `fs`, `path`, or similar errors in client components, check for server-only imports

---

## Architectural Decisions

### 1. Single Public Login Page

**Decision**: Use `/login` for all users (admins and customers), not separate login pages.

**Rationale**:
- Simpler UX - one login URL to remember
- Easier to maintain - one login flow
- Role-based redirects after authentication
- Prevents redirect loops

**Implementation Pattern**:
```typescript
// After successful login
if (user.role === "admin") {
  router.push("/admin");
} else {
  router.push("/account");
}
```

---

### 2. Soft Delete Pattern

**Decision**: Use `isActive` flag instead of hard deletes.

**Rationale**:
- Preserve historical data for reporting
- Can "restore" accidentally deleted tools
- Maintain referential integrity with bookings
- Easier debugging

**Implementation**:
```typescript
// Delete tool
await prisma.tool.update({
  where: { id },
  data: { isActive: false }
});

// Fetch active tools only
const tools = await prisma.tool.findMany({
  where: { isActive: true }
});
```

**Booking Validation**:
```typescript
// Prevent deletion if active bookings exist
const activeBookings = await prisma.booking.count({
  where: {
    toolId: id,
    rentalEndDate: { gte: new Date() }
  }
});

if (activeBookings > 0) {
  return NextResponse.json({
    error: `Cannot delete tool with ${activeBookings} active booking(s)`
  }, { status: 400 });
}
```

---

### 3. Transaction Pooler vs Direct Connection

**Decision**: Use transaction pooler for runtime, direct connection for migrations.

**Configuration**:
```env
# .env.local
DATABASE_URL="postgres://..."                    # Pooler (port 6543)
DIRECT_URL="postgres://...?sslmode=require"      # Direct (port 5432)
```

**Prisma Schema**:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooler for app
  directUrl = env("DIRECT_URL")        // Direct for migrations
}
```

**Rationale**:
- Transaction pooler prevents serverless connection exhaustion
- Direct connection required for schema migrations
- Best practice for Next.js + Supabase

---

### 4. Prisma 7 with pg Adapter

**Decision**: Use Prisma 7's new adapter pattern with native `pg` driver.

**Implementation** [lib/prisma.ts](../lib/prisma.ts):
```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"],
});
```

**Rationale**:
- Better performance than previous connection methods
- Connection pooling built-in
- Recommended by Prisma for serverless environments

---

## Authentication Architecture

### Supabase Auth Setup

**Components**:

1. **Browser Client** [lib/supabase/client.ts](../lib/supabase/client.ts):
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

2. **Server Client** [lib/supabase/server.ts](../lib/supabase/server.ts):
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => { ... }
      }
    }
  );
}
```

3. **Middleware** [middleware.ts](../middleware.ts):
```typescript
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { ... } }
  );

  // Refreshes the session
  await supabase.auth.getUser();

  return response;
}
```

**Flow**:
1. User logs in via `LoginForm` (client component)
2. Supabase Auth creates session (stored in cookies)
3. Middleware refreshes session on every request
4. Server components can access user via `createClient()`
5. Protected routes check user role and redirect if needed

---

## Client vs Server Component Boundaries

### When to Use Client Components

✅ **Use "use client" when**:
- Using React hooks (`useState`, `useEffect`, `useRouter`, etc.)
- Handling user interactions (forms, buttons with `onClick`)
- Using browser APIs (localStorage, window, etc.)
- Need real-time updates (`useTransition`, `useOptimistic`)

❌ **Don't use "use client" when**:
- Fetching data from database
- Using environment variables (server-side only ones)
- Rendering static content
- Using Prisma or other Node.js libraries

### Key Files and Their Types

**Server Components** (default):
- `app/page.tsx` - Homepage
- `app/tools/page.tsx` - Tool catalog
- `app/tools/[slug]/page.tsx` - Tool detail
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/tools/page.tsx` - Tools list

**Client Components** (marked "use client"):
- `components/auth/LoginForm.tsx` - Login form with state
- `components/admin/ToolForm.tsx` - Tool create/edit form
- `components/admin/ToolActions.tsx` - Tool actions with optimistic updates
- `components/admin/LogoutButton.tsx` - Logout with Supabase client
- `components/tools/SearchBar.tsx` - Search with transitions
- `components/tools/CategoryFilter.tsx` - Filter with state

### Data Flow Pattern

**Pattern 1**: Server Component fetches → passes to Client Component
```typescript
// app/tools/page.tsx (Server Component)
export default async function ToolsPage() {
  const tools = await getAllTools();  // Database query
  const categories = await getAllCategories();

  return (
    <div>
      <SearchBar />  {/* Client Component */}
      <CategoryFilter categories={categories} />  {/* Client Component */}
      <ToolGrid tools={tools} />  {/* Can be Server Component */}
    </div>
  );
}
```

**Pattern 2**: Client Component calls API → API uses Prisma
```typescript
// components/admin/ToolForm.tsx (Client Component)
const handleSubmit = async (e: React.FormEvent) => {
  const response = await fetch("/api/admin/tools", {
    method: "POST",
    body: JSON.stringify(formData)
  });
};

// app/api/admin/tools/route.ts (API Route)
export async function POST(request: Request) {
  const data = await request.json();
  const tool = await prisma.tool.create({ data });  // ✅ Prisma OK in API routes
  return NextResponse.json(tool);
}
```

---

## Database & Prisma Best Practices

### 1. Decimal to Number Conversion

**Issue**: Prisma 7 returns Decimal type for database DECIMAL columns, but TypeScript components expect numbers.

**Solution**: Convert in data fetching functions

[lib/tools.ts](../lib/tools.ts):
```typescript
export async function getAllTools(): Promise<Tool[]> {
  const tools = await prisma.tool.findMany({
    include: { category: true }
  });

  return tools.map((tool) => ({
    ...tool,
    dailyRate: Number(tool.dailyRate),        // Convert Decimal → number
    depositAmount: Number(tool.depositAmount)
  }));
}
```

**Alternative**: Type cast when needed
```typescript
const rate = Number(tool.dailyRate);
```

---

### 2. Snake Case Mapping

**Database Columns**: Use snake_case (PostgreSQL convention)
**TypeScript/Prisma**: Use camelCase (JavaScript convention)

[prisma/schema.prisma](../prisma/schema.prisma):
```prisma
model Tool {
  id            String   @id @default(uuid())
  dailyRate     Decimal  @map("daily_rate")      // TS: dailyRate, DB: daily_rate
  depositAmount Decimal  @map("deposit_amount")
  categoryId    String   @map("category_id")
  isActive      Boolean  @map("is_active")
  isFeatured    Boolean  @map("is_featured")

  @@map("tools")  // Table name: tools (plural)
}
```

**Benefits**:
- Follows PostgreSQL naming conventions
- Clean TypeScript/JavaScript code
- Prisma handles mapping automatically

---

### 3. Relationship Loading

**Include Relations**:
```typescript
const tool = await prisma.tool.findUnique({
  where: { slug },
  include: {
    category: true,
    bookings: true  // If needed
  }
});
```

**Select Specific Fields**:
```typescript
const tools = await prisma.tool.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    dailyRate: true,
    category: {
      select: { name: true }
    }
  }
});
```

---

### 4. Query Logging

Enabled in development for debugging:

```typescript
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]   // See SQL queries
    : ["error"],                    // Production: errors only
});
```

**Example Output**:
```
prisma:query INSERT INTO "public"."tools" ("id","name","slug",...) VALUES (...)
POST /api/admin/tools 200 in 1758ms
```

---

## Environment Configuration

### Required Variables

[.env.local](.env.local) (actual file - **DO NOT COMMIT**):
```env
# Database
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Igloohome (Phase 4)
IGLOOHOME_DEFAULT_LOCK_ID="your-lock-id-here"
IGLOOHOME_CLIENT_ID=""
IGLOOHOME_CLIENT_SECRET=""

# Resend (Phase 4)
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""

# Business Info (Phase 6)
BUSINESS_NAME="Utah Valley Tool Rental"
BUSINESS_ADDRESS=""
BUSINESS_PHONE=""
BUSINESS_EMAIL=""
```

### Variable Prefixes

**`NEXT_PUBLIC_*`**: Exposed to browser (client components)
- Supabase URL and anon key
- Stripe publishable key
- App URL

**No prefix**: Server-side only
- Database URLs
- Stripe secret key
- API secrets

---

## Next Steps for Phase 3

### What Phase 3 Needs to Build

1. **Availability Calendar Component**
   - Date range picker
   - Visual display of available/booked dates
   - Disabled dates for existing bookings

2. **Booking Conflict Detection**
   - Query bookings for tool + date range
   - Prevent double bookings
   - Real-time availability checks

3. **Guest Checkout Form**
   - Customer name, email, phone (no account required)
   - Rental date selection
   - Price calculation (rental fee + deposit)
   - Form validation with Zod

4. **Stripe Payment Integration**
   - Create Stripe PaymentIntent
   - Collect card info with Stripe Elements
   - Handle payment confirmation
   - Loading and error states

5. **Booking Creation**
   - Create booking record on payment success
   - Store customer info
   - Set booking status to "confirmed"
   - Store traffic source (Facebook tracking)

6. **Stripe Webhook Endpoint**
   - Handle `payment_intent.succeeded`
   - Update booking status
   - Error logging

7. **Confirmation Page**
   - Show booking details
   - Display pickup instructions
   - Next steps (access code will come in Phase 4)

### Files to Create in Phase 3

```
app/
├── tools/
│   └── [slug]/
│       └── book/
│           └── page.tsx  (Booking page)
├── booking/
│   └── [id]/
│       ├── page.tsx  (Confirmation page)
│       └── not-found.tsx
└── api/
    ├── bookings/
    │   └── route.ts  (POST create booking)
    ├── availability/
    │   └── route.ts  (POST check availability)
    ├── create-payment-intent/
    │   └── route.ts  (POST create Stripe PaymentIntent)
    └── webhooks/
        └── stripe/
            └── route.ts  (POST webhook handler)

components/
├── booking/
│   ├── AvailabilityCalendar.tsx
│   ├── DateRangePicker.tsx
│   ├── CheckoutForm.tsx
│   ├── PaymentForm.tsx
│   └── PriceBreakdown.tsx

lib/
├── bookings.ts  (Booking CRUD operations)
├── availability.ts  (Availability checking logic)
└── stripe-helpers.ts  (Stripe utility functions)
```

### Critical Considerations for Phase 3

#### 1. Date Handling

**Recommendation**: Use UTC dates consistently
```typescript
const startDate = new Date(Date.UTC(year, month, day));
```

**Why**: Avoids timezone issues when checking availability.

#### 2. Booking Conflict Logic

**Query Pattern**:
```typescript
const conflictingBookings = await prisma.booking.findMany({
  where: {
    toolId,
    status: { in: ["confirmed", "pending_code"] },
    OR: [
      // New booking starts during existing booking
      {
        rentalStartDate: { lte: newStartDate },
        rentalEndDate: { gte: newStartDate }
      },
      // New booking ends during existing booking
      {
        rentalStartDate: { lte: newEndDate },
        rentalEndDate: { gte: newEndDate }
      },
      // New booking completely contains existing booking
      {
        rentalStartDate: { gte: newStartDate },
        rentalEndDate: { lte: newEndDate }
      }
    ]
  }
});

return conflictingBookings.length === 0;  // Available if no conflicts
```

#### 3. Stripe PaymentIntent Pattern

**Flow**:
1. Customer selects dates
2. Frontend calculates price (rental + deposit)
3. Frontend calls `/api/create-payment-intent` with booking details
4. API creates Stripe PaymentIntent and pending booking
5. Return client secret to frontend
6. Stripe Elements collects payment
7. Webhook confirms payment and updates booking status

**Why**: Prevents race conditions and ensures payment is captured before confirming booking.

#### 4. Webhook Security

**MUST implement**:
```typescript
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  const event = stripe.webhooks.constructEvent(
    body,
    signature!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  // Process event...
}
```

**Why**: Verifies webhook actually came from Stripe, not a malicious actor.

#### 5. Guest Booking Data

**Store in Booking**:
```typescript
model Booking {
  id             String   @id @default(uuid())
  userId         String?  @map("user_id")  // Nullable for guest bookings
  customerName   String   @map("customer_name")
  customerEmail  String   @map("customer_email")
  customerPhone  String   @map("customer_phone")
  // ... rest of fields
}
```

**Why**: Guest bookings don't have a userId, so store contact info directly.

---

## Common Pitfalls to Avoid

### ❌ Don't: Import Prisma in Client Components
```typescript
"use client";
import { prisma } from "@/lib/prisma";  // ❌ Will cause 'fs' error
```

### ✅ Do: Use API routes for database operations
```typescript
"use client";
const response = await fetch("/api/bookings", { ... });  // ✅ Correct
```

---

### ❌ Don't: Put auth pages inside protected directories
```
app/admin/
├── layout.tsx (protected)
└── login/page.tsx  // ❌ Creates redirect loop
```

### ✅ Do: Keep auth pages at root level
```
app/
├── login/page.tsx  // ✅ Public route
└── admin/
    └── layout.tsx (protected)
```

---

### ❌ Don't: Use "use client" unnecessarily
```typescript
"use client";  // ❌ Not needed if no hooks/interactions
export default function ToolsList({ tools }) {
  return <div>{tools.map(...)}</div>;
}
```

### ✅ Do: Use Server Components by default
```typescript
// No "use client" directive  // ✅ Server Component
export default function ToolsList({ tools }) {
  return <div>{tools.map(...)}</div>;
}
```

---

### ❌ Don't: Forget to convert Prisma Decimals
```typescript
const tool = await prisma.tool.findUnique(...);
return tool;  // ❌ dailyRate is Decimal type, not number
```

### ✅ Do: Convert in data access layer
```typescript
const tool = await prisma.tool.findUnique(...);
return {
  ...tool,
  dailyRate: Number(tool.dailyRate)  // ✅ Convert to number
};
```

---

### ❌ Don't: Use hard deletes
```typescript
await prisma.tool.delete({ where: { id } });  // ❌ Loses data
```

### ✅ Do: Use soft deletes
```typescript
await prisma.tool.update({
  where: { id },
  data: { isActive: false }  // ✅ Preserves data
});
```

---

## User Setup Answered Questions

### 1. Igloohome Locks
**Answer**: 1 Igloohome padlock for all tools (stored in `IGLOOHOME_DEFAULT_LOCK_ID`)

### 2. Facebook Marketplace Tracking
**Answer**: Manual tracking URLs. User will create listings manually with `?source=fb&listing_id=X` parameters.

### 3. Deposit Refunds
**Answer**: Automatic refunds after rental period ends (manual in Phase 3, potentially automated later).

### 4. Initial Categories
**Answer**: Start with 2 categories:
- Power Tools
- Lawn Equipment

### 5. Admin Creation
**Answer**: First admin created via Supabase Auth Dashboard + SQL query. Admin user management UI in Phase 5.

---

## Helpful Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma 7 Docs](https://www.prisma.io/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Key Commands
```bash
# Development
npm run dev

# Database
./node_modules/.bin/prisma migrate dev --name description
./node_modules/.bin/prisma generate
npm run db:seed

# Prisma Studio (DB GUI)
./node_modules/.bin/prisma studio
```

---

## Summary

**Phase 1 & 2 are complete and working!** The application has:
- ✅ Complete tool browsing experience
- ✅ Admin dashboard with full CRUD
- ✅ Authentication with role-based access
- ✅ Database schema ready for bookings
- ✅ Type-safe codebase with TypeScript
- ✅ Production-ready architecture

**Phase 3** will add the booking and payment system, completing the core customer flow.

---

**Next Action**: Read this document thoroughly before starting Phase 3 to avoid repeating errors and understand the established patterns.
