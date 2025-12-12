# Product Requirements Document: Utah Valley Tool Rental V3

## Executive Summary

Utah Valley Tool Rental V3 is a lean, mobile-first tool rental platform optimized for direct traffic from Facebook Marketplace listings. The system enables guest checkout with Stripe payments, automated Igloohome smart lock access code delivery, and a streamlined admin dashboard for managing inventory, bookings, and analytics.

**Core Value Proposition**: Customers click a Facebook Marketplace link for a specific tool, see real-time availability, book instantly without creating an account, and receive smart lock access codes via email - all in under 2 minutes.

## Product Goals

### Primary Objectives
1. **Conversion Optimization**: Minimize friction from Facebook click to booking confirmation (target: <2 minute checkout)
2. **Operational Simplicity**: Single-location, admin-managed inventory with automated access code delivery
3. **Technical Lean-ness**: Use only essential infrastructure (Next.js 15, Supabase, Stripe, Igloohome, Resend)
4. **Scalability Foundation**: Architecture supports future multi-location expansion

### Success Metrics
- Booking conversion rate from Facebook Marketplace traffic
- Average time from landing to booking confirmation
- Admin time spent on manual booking management
- System uptime and payment success rate

## User Roles

### 1. Guest Customer (Primary User)
**Description**: Individual seeking to rent a specific tool, arriving via Facebook Marketplace link

**Goals**:
- Quickly understand tool availability and pricing
- Complete booking without creating an account
- Receive access codes immediately after payment
- Optionally create account for order history

**Pain Points**:
- Doesn't want to create account for one-time rental
- Needs immediate confirmation and access details
- May want to browse other tools but came for specific item

### 2. Registered Customer (Optional)
**Description**: Repeat customer who created account for order tracking

**Goals**:
- View booking history
- Track current rentals
- Faster checkout with saved information

### 3. Admin (Internal User)
**Description**: Tool rental business owner/staff managing operations

**Goals**:
- Manage tool inventory (add/edit/delete tools)
- Monitor bookings in real-time
- Override/regenerate access codes when needed
- View analytics on tool utilization and revenue
- Control which tools appear in footer navigation
- Grant admin access to other users

**Pain Points**:
- Needs quick access to booking issues
- Must handle edge cases (lost access codes, early returns)

## Core Features & User Stories

### Feature 1: Direct Tool Landing Pages

#### User Story 1.1: Facebook Marketplace to Tool Page
**As a** potential customer clicking a Facebook Marketplace listing
**I want to** land directly on the specific tool's page with all rental information
**So that** I can immediately see if the tool is available for my needed dates

**Acceptance Criteria**:
1. WHEN customer clicks Facebook Marketplace link THEN system SHALL load tool detail page within 2 seconds
2. WHEN page loads THEN system SHALL display tool name, images, daily rate, deposit amount, and availability calendar
3. WHEN page loads with `?source=fb&listing_id={id}` parameters THEN system SHALL track this traffic source for analytics
4. IF tool is unavailable or deleted THEN system SHALL display friendly error with link to catalog page

#### User Story 1.2: View Real-Time Availability
**As a** customer on a tool page
**I want to** see a calendar showing available and booked dates
**So that** I can select valid rental dates

**Acceptance Criteria**:
1. WHEN customer views calendar THEN system SHALL display current month and next 60 days
2. WHEN customer hovers over date THEN system SHALL indicate if date is available or booked
3. WHEN customer selects start date THEN system SHALL only allow end dates that maintain availability
4. WHEN customer selects date range THEN system SHALL calculate and display total price (days × daily_rate + deposit)
5. IF rental period is less than 1 day THEN system SHALL prevent selection and show error message

### Feature 2: Guest Checkout with Stripe

#### User Story 2.1: Complete Guest Checkout
**As a** customer ready to book a tool
**I want to** pay with credit card without creating an account
**So that** I can complete my rental quickly

**Acceptance Criteria**:
1. WHEN customer clicks "Book Now" THEN system SHALL display checkout form requesting: name, email, phone
2. WHEN customer submits valid contact info THEN system SHALL initialize Stripe PaymentIntent with total amount (rental_fee + deposit)
3. WHEN customer completes Stripe payment THEN system SHALL create booking record with status "confirmed"
4. WHEN payment succeeds THEN system SHALL send confirmation email with booking details and access codes
5. IF payment fails THEN system SHALL display error and allow retry without losing date selection

#### User Story 2.2: Security Deposit Handling
**As a** customer completing checkout
**I want to** understand the deposit is refundable
**So that** I know the total charge breakdown

**Acceptance Criteria**:
1. WHEN checkout displays price breakdown THEN system SHALL show: "Rental Fee: $X × Y days = $Z, Refundable Deposit: $D, Total: $T"
2. WHEN payment is processed THEN system SHALL charge full amount (rental + deposit) as single Stripe transaction
3. WHEN admin marks booking as returned THEN system SHALL record deposit as eligible for refund (manual process for V3)

### Feature 3: Igloohome Access Code Generation

#### User Story 3.1: Automated Access Code Delivery
**As a** customer who completed payment
**I want to** receive smart lock access codes immediately
**So that** I can pick up the tool during my rental period

**Acceptance Criteria**:
1. WHEN payment is confirmed THEN system SHALL call Igloohome API to generate time-bound access code
2. WHEN generating code THEN system SHALL set validity period from rental_start_date 00:00 to rental_end_date 23:59 (local timezone)
3. WHEN code is generated THEN system SHALL store code in booking record
4. WHEN code is stored THEN system SHALL include code in confirmation email template
5. IF Igloohome API fails THEN system SHALL log error, notify admin, and mark booking as "pending_code"

#### User Story 3.2: Access Code Expiration
**As a** business owner
**I want** access codes to automatically expire after rental period
**So that** security is maintained without manual intervention

**Acceptance Criteria**:
1. WHEN access code is generated THEN system SHALL set expiration to rental_end_date + 23:59:59
2. WHEN rental period ends THEN Igloohome SHALL automatically invalidate code
3. WHEN customer attempts late return THEN system SHALL display message to contact admin for code extension

### Feature 4: Tool Catalog & Discovery

#### User Story 4.1: Browse Tool Catalog
**As a** customer who wants to see other tools
**I want to** navigate to a catalog page with search functionality
**So that** I can find tools beyond my initial Facebook click

**Acceptance Criteria**:
1. WHEN customer clicks "Browse All Tools" link THEN system SHALL display catalog page with all active tools
2. WHEN catalog loads THEN system SHALL show minimal company introduction section (2-3 sentences + location)
3. WHEN catalog displays tools THEN system SHALL show grid layout with tool image, name, daily rate, and availability status
4. WHEN customer types in search bar THEN system SHALL filter tools by name, category, or description in real-time
5. WHEN customer clicks tool card THEN system SHALL navigate to tool detail page

#### User Story 4.2: Category Navigation
**As a** customer browsing tools
**I want to** filter by category
**So that** I can find relevant tools faster

**Acceptance Criteria**:
1. WHEN catalog page loads THEN system SHALL display category filter buttons (e.g., Power Tools, Lawn Equipment, Ladders)
2. WHEN customer clicks category THEN system SHALL show only tools in that category
3. WHEN customer clears filter THEN system SHALL show all tools again

### Feature 5: Admin Dashboard

#### User Story 5.1: Admin Authentication
**As an** admin user
**I want to** log in with username and password
**So that** I can access admin-only features

**Acceptance Criteria**:
1. WHEN user navigates to `/admin` THEN system SHALL redirect to login page if not authenticated
2. WHEN user submits valid admin credentials THEN system SHALL authenticate via Supabase Auth
3. WHEN authentication succeeds THEN system SHALL check if user has `role = 'admin'` in user_profiles table
4. IF user is not admin THEN system SHALL deny access and show error
5. WHEN authenticated admin accesses `/admin` THEN system SHALL display dashboard home

#### User Story 5.2: Manage Tool Inventory
**As an** admin
**I want to** add, edit, and delete tools
**So that** I can keep the catalog current

**Acceptance Criteria**:
1. WHEN admin clicks "Add Tool" THEN system SHALL display form with fields: name, description, category, daily_rate, deposit_amount, image_upload, igloohome_lock_id
2. WHEN admin submits valid tool data THEN system SHALL create tool record and upload image to Supabase Storage
3. WHEN admin edits tool THEN system SHALL update record and preserve existing bookings
4. WHEN admin deletes tool with no active bookings THEN system SHALL soft-delete (set is_active = false)
5. IF tool has active bookings THEN system SHALL prevent deletion and show warning

#### User Story 5.3: Booking Management
**As an** admin
**I want to** view all bookings and their statuses
**So that** I can monitor operations

**Acceptance Criteria**:
1. WHEN admin accesses bookings page THEN system SHALL display table with: booking_id, customer_name, tool_name, rental_dates, status, access_code
2. WHEN admin filters by status THEN system SHALL show only matching bookings (confirmed, pending_code, completed, cancelled)
3. WHEN admin searches by customer name or booking ID THEN system SHALL filter results in real-time
4. WHEN admin marks booking as "completed" THEN system SHALL update status and log return timestamp

#### User Story 5.4: Manual Access Code Regeneration
**As an** admin
**I want to** manually regenerate access codes
**So that** I can handle edge cases (lost codes, early pickup)

**Acceptance Criteria**:
1. WHEN admin clicks "Regenerate Code" on booking THEN system SHALL call Igloohome API with same validity period
2. WHEN new code is generated THEN system SHALL update booking record and display new code
3. WHEN admin clicks "Send Code Email" THEN system SHALL resend confirmation email with current access code
4. WHEN admin extends rental period THEN system SHALL regenerate code with new end date

#### User Story 5.5: Analytics Dashboard
**As an** admin
**I want to** view key metrics and traffic sources
**So that** I can make data-driven decisions

**Acceptance Criteria**:
1. WHEN admin accesses analytics page THEN system SHALL display: total bookings (current month), revenue (current month), top tools by bookings, average rental duration
2. WHEN admin views traffic sources THEN system SHALL show breakdown of bookings by source (facebook_marketplace vs direct vs catalog)
3. WHEN admin selects date range THEN system SHALL update all metrics for selected period
4. WHEN admin views tool utilization THEN system SHALL show booking rate % per tool

#### User Story 5.6: Featured Footer Tools Management
**As an** admin
**I want to** select which tools appear in the footer navigation
**So that** I can promote specific tools across the site

**Acceptance Criteria**:
1. WHEN admin accesses footer settings THEN system SHALL display list of all active tools with "Featured" toggle
2. WHEN admin enables "Featured" for tool THEN system SHALL add tool to footer navigation site-wide
3. WHEN admin disables "Featured" THEN system SHALL remove tool from footer
4. WHEN admin saves changes THEN system SHALL update footer immediately (no cache delay)

#### User Story 5.7: Grant Admin Access
**As an** admin
**I want to** promote other users to admin role
**So that** I can delegate management tasks

**Acceptance Criteria**:
1. WHEN admin navigates to user management page THEN system SHALL display list of all registered users
2. WHEN admin clicks "Grant Admin Access" for user THEN system SHALL update user's role to 'admin' in user_profiles table
3. WHEN admin revokes access THEN system SHALL update role to 'customer'
4. WHEN admin updates roles THEN system SHALL log action in audit trail

### Feature 6: Email Notifications

#### User Story 6.1: Booking Confirmation Email
**As a** customer who completed payment
**I want to** receive a detailed confirmation email
**So that** I have all rental details and access codes

**Acceptance Criteria**:
1. WHEN booking is confirmed THEN system SHALL send email via Resend API within 30 seconds
2. WHEN email is sent THEN message SHALL include: booking_id, tool_name, rental_dates, total_paid, deposit_amount, access_code, pickup_location, return_instructions
3. WHEN email fails to send THEN system SHALL retry up to 3 times and log failure for admin review
4. WHEN email is successfully sent THEN system SHALL update booking record with email_sent_at timestamp

#### User Story 6.2: Return Reminder Email
**As a** customer approaching rental end date
**I want to** receive a reminder to return the tool
**So that** I avoid late fees and code expiration issues

**Acceptance Criteria**:
1. WHEN rental_end_date is 1 day away THEN system SHALL send return reminder email
2. WHEN email is sent THEN message SHALL include: tool_name, return_deadline, return_location, access_code_expiration
3. WHEN reminder is sent THEN system SHALL update booking with reminder_sent_at timestamp

### Feature 7: Optional Customer Accounts

#### User Story 7.1: Post-Checkout Account Creation
**As a** customer who completed guest checkout
**I want to** optionally create an account
**So that** I can track my booking history

**Acceptance Criteria**:
1. WHEN customer completes booking THEN confirmation page SHALL display "Create Account to Track Your Orders" option
2. WHEN customer chooses to create account THEN system SHALL pre-fill email from booking and request password
3. WHEN account is created THEN system SHALL link existing booking to new user_id
4. WHEN customer logs in THEN system SHALL display booking history page

#### User Story 7.2: View Booking History
**As a** registered customer
**I want to** see my past and current bookings
**So that** I can reference rental details

**Acceptance Criteria**:
1. WHEN logged-in customer accesses `/account` THEN system SHALL display list of bookings sorted by rental_start_date (descending)
2. WHEN customer views booking details THEN system SHALL show: tool_name, rental_dates, access_code (if current), payment_amount
3. WHEN rental is active THEN system SHALL display access code prominently
4. WHEN rental is past THEN system SHALL show "Completed" status without access code

## Non-Functional Requirements

### Performance
1. Tool detail page load time SHALL be under 2 seconds on 4G mobile connection
2. Search/filter on catalog page SHALL return results in under 500ms
3. Stripe payment confirmation SHALL process in under 5 seconds
4. Igloohome API calls SHALL timeout after 10 seconds with graceful error handling

### Security
1. All payment processing SHALL use Stripe secure elements (no card data touches server)
2. Admin routes SHALL require authentication and role verification
3. Access codes SHALL be transmitted only via email (not displayed in URLs)
4. Database connections SHALL use SSL encryption

### Scalability
1. System SHALL support up to 100 concurrent bookings per day
2. Database schema SHALL accommodate future multi-location expansion (location_id foreign key ready)
3. Image storage SHALL use Supabase Storage with CDN delivery

### Mobile Optimization
1. All pages SHALL be responsive and mobile-first designed
2. Touch targets SHALL be minimum 44×44px
3. Forms SHALL use appropriate mobile input types (tel, email, number)

### Reliability
1. System SHALL maintain 99% uptime (measured monthly)
2. Failed Igloohome API calls SHALL trigger admin notifications
3. Payment webhook failures SHALL be logged and retried

## Technical Architecture Overview

### Frontend Stack
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Design Tool**: Claude Designer Skill for UI generation
- **State**: React hooks (minimal client-side state)
- **Forms**: React Hook Form + Zod validation

### Backend Stack
- **API**: Next.js Route Handlers (`/api/*`)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 6.x
- **Auth**: Supabase Auth (username/password for admin + optional customer accounts)
- **Payments**: Stripe PaymentIntents + Webhooks
- **Email**: Resend API
- **Smart Locks**: Igloohome API

### Infrastructure
- **Hosting**: Vercel (Edge Network)
- **Database**: Supabase (managed PostgreSQL)
- **File Storage**: Supabase Storage
- **Environment**: Node.js 20.x

### Key Integrations

#### Stripe Payment Flow
1. Customer selects dates → Frontend calculates total
2. Frontend calls `POST /api/create-payment-intent` → Backend creates PaymentIntent
3. Customer completes Stripe checkout → Stripe sends webhook to `/api/webhooks/stripe`
4. Webhook handler confirms payment → Creates booking + generates access code + sends email

#### Igloohome Access Code Flow
1. Booking confirmed → Backend calls Igloohome API `/locks/{lock_id}/pins`
2. API generates time-bound PIN with validity period
3. Backend stores PIN in `bookings.access_code` field
4. Email template includes PIN and instructions

## Database Schema (Prisma Models)

### Tools
```prisma
model Tool {
  id               String    @id @default(uuid())
  name             String
  slug             String    @unique
  description      String
  category_id      String
  daily_rate       Decimal   @db.Decimal(10, 2)
  deposit_amount   Decimal   @db.Decimal(10, 2)
  image_url        String?
  igloohome_lock_id String?
  is_active        Boolean   @default(true)
  is_featured      Boolean   @default(false)
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  category         Category  @relation(fields: [category_id], references: [id])
  bookings         Booking[]
}
```

### Bookings
```prisma
model Booking {
  id                String    @id @default(uuid())
  tool_id           String
  user_id           String?   // Nullable for guest checkouts
  customer_name     String
  customer_email    String
  customer_phone    String
  rental_start_date DateTime
  rental_end_date   DateTime
  total_amount      Decimal   @db.Decimal(10, 2)
  rental_fee        Decimal   @db.Decimal(10, 2)
  deposit_amount    Decimal   @db.Decimal(10, 2)
  access_code       String?
  status            String    @default("pending") // pending, confirmed, pending_code, completed, cancelled
  payment_intent_id String?   @unique
  traffic_source    String?   // e.g., "facebook_marketplace", "direct", "catalog"
  fb_listing_id     String?
  email_sent_at     DateTime?
  reminder_sent_at  DateTime?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  tool              Tool      @relation(fields: [tool_id], references: [id])
  user              User?     @relation(fields: [user_id], references: [id])
}
```

### Users (Supabase Auth Integration)
```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  role            String    @default("customer") // "customer" or "admin"
  created_at      DateTime  @default(now())

  bookings        Booking[]
}
```

### Categories
```prisma
model Category {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  created_at  DateTime @default(now())

  tools       Tool[]
}
```

### PaymentIntents (Stripe Tracking)
```prisma
model PaymentIntent {
  id                  String   @id @default(uuid())
  stripe_intent_id    String   @unique
  amount              Decimal  @db.Decimal(10, 2)
  status              String   // "pending", "succeeded", "failed"
  booking_id          String?  @unique
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
}
```

## API Endpoints Specification

### Public APIs

#### `POST /api/tools/availability`
**Purpose**: Check tool availability for date range
**Request**:
```json
{
  "tool_id": "uuid",
  "start_date": "2025-01-15",
  "end_date": "2025-01-17"
}
```
**Response**:
```json
{
  "available": true,
  "conflicting_bookings": []
}
```

#### `POST /api/create-payment-intent`
**Purpose**: Initialize Stripe payment for booking
**Request**:
```json
{
  "tool_id": "uuid",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "rental_start_date": "2025-01-15",
  "rental_end_date": "2025-01-17",
  "traffic_source": "facebook_marketplace",
  "fb_listing_id": "123456"
}
```
**Response**:
```json
{
  "client_secret": "pi_xxx_secret_yyy",
  "booking_id": "uuid"
}
```

#### `POST /api/webhooks/stripe`
**Purpose**: Handle Stripe payment confirmations
**Webhook Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`
**Actions**:
- Update booking status
- Generate Igloohome access code
- Send confirmation email

### Admin APIs

#### `GET /api/admin/bookings`
**Auth**: Required (admin role)
**Query Params**: `?status=confirmed&start_date=2025-01-01&end_date=2025-01-31`
**Response**:
```json
{
  "bookings": [
    {
      "id": "uuid",
      "tool_name": "Power Drill",
      "customer_name": "John Doe",
      "rental_dates": "2025-01-15 to 2025-01-17",
      "status": "confirmed",
      "access_code": "123456"
    }
  ]
}
```

#### `POST /api/admin/bookings/:id/regenerate-code`
**Auth**: Required (admin role)
**Purpose**: Manually regenerate access code
**Response**:
```json
{
  "access_code": "654321",
  "valid_until": "2025-01-17T23:59:59Z"
}
```

#### `POST /api/admin/tools`
**Auth**: Required (admin role)
**Purpose**: Create new tool
**Request**: FormData with fields + image file
**Response**:
```json
{
  "tool": {
    "id": "uuid",
    "name": "Circular Saw",
    "slug": "circular-saw"
  }
}
```

#### `PATCH /api/admin/tools/:id/featured`
**Auth**: Required (admin role)
**Purpose**: Toggle featured status for footer
**Request**:
```json
{
  "is_featured": true
}
```

#### `GET /api/admin/analytics`
**Auth**: Required (admin role)
**Query Params**: `?start_date=2025-01-01&end_date=2025-01-31`
**Response**:
```json
{
  "total_bookings": 45,
  "total_revenue": 3250.00,
  "top_tools": [
    {"tool_name": "Power Drill", "bookings": 12}
  ],
  "traffic_sources": {
    "facebook_marketplace": 38,
    "direct": 5,
    "catalog": 2
  }
}
```

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For Prisma migrations

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # For admin operations

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Igloohome
IGLOOHOME_API_KEY="xxx"
IGLOOHOME_API_SECRET="yyy"
IGLOOHOME_BASE_URL="https://api.igloohome.co"

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="bookings@utahvalleytoolrental.com"

# App Config
NEXT_PUBLIC_APP_URL="https://utahvalleytoolrental.com"
BUSINESS_LOCATION="123 Main St, Provo, UT 84601"
BUSINESS_PHONE="+1234567890"
```

## Deployment Requirements

### Vercel Configuration
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 20.x

### Environment Setup
1. Add all environment variables to Vercel project settings
2. Configure Supabase connection pooler URL for `DATABASE_URL`
3. Set up Stripe webhook endpoint: `https://[domain]/api/webhooks/stripe`
4. Configure Resend verified domain

### Database Migrations
```bash
# Initial setup
npx prisma migrate deploy

# Seed initial data (categories)
npx prisma db seed
```

### Post-Deployment Checklist
- [ ] Test Stripe payment flow in production mode
- [ ] Verify Igloohome API connectivity
- [ ] Send test booking confirmation email
- [ ] Confirm webhook endpoint receives Stripe events
- [ ] Create initial admin user in Supabase Auth
- [ ] Upload test tool images to Supabase Storage
- [ ] Verify Facebook Marketplace link with tracking parameters

## Future Considerations (Out of Scope for V3)

1. **Multi-Location Support**: Add `location_id` foreign key to tools and bookings
2. **SMS Notifications**: Integrate Twilio for access code delivery
3. **Dynamic Pricing**: Weekend rates, bulk discounts, seasonal pricing
4. **Automated Deposit Refunds**: Stripe refund API integration
5. **Customer Reviews**: Rating system for tools
6. **Late Fee Automation**: Automatic charges for overdue returns
7. **Inventory Management**: Quantity tracking for tools with multiple units
8. **Mobile App**: React Native app for faster booking experience

## Appendix: Edge Cases & Error Handling

### Payment Failures
- **Scenario**: Stripe payment fails after customer submits
- **Handling**: Display user-friendly error, retain date selection, allow retry

### Igloohome API Downtime
- **Scenario**: Igloohome API unavailable during booking confirmation
- **Handling**: Mark booking as `pending_code`, notify admin via email, display message to customer that code will be sent within 1 hour

### Double Booking Prevention
- **Scenario**: Two customers attempt to book same tool for overlapping dates
- **Handling**: Use database transaction with row-level locking on availability check + booking creation

### Access Code Lost
- **Scenario**: Customer loses confirmation email with access code
- **Handling**: Provide "Resend Access Code" button on booking confirmation page (email lookup)

### Early Return
- **Scenario**: Customer returns tool before rental_end_date
- **Handling**: Admin marks booking as completed early; deposit refund handled manually for V3

### Late Return
- **Scenario**: Customer attempts to access lock after rental_end_date
- **Handling**: Access code expired by Igloohome; customer must contact admin for extension

---

**Document Version**: 1.0
**Last Updated**: 2025-12-08
**Author**: Product Team
**Status**: Ready for Design Phase
