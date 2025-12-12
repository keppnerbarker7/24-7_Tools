# Utah Valley Tool Rental V3 - Implementation Workflow

**Last Updated**: 2025-12-08
**Status**: Planning Phase

---

## Quick Reference

- **Total Features**: 7 major feature areas
- **Total Phases**: 5 implementation phases
- **Tech Stack**: Next.js 15, Supabase, Prisma, Stripe, Igloohome, Resend
- **Target**: Single-location, mobile-first tool rental platform

---

## Implementation Phases

### Phase 1: Foundation & Infrastructure ⏳ CURRENT
**Goal**: Set up project structure, database, authentication, and core dependencies

#### 1.1 Project Setup
- [ ] Initialize Next.js 15 project with App Router
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up TypeScript configuration
- [ ] Create directory structure (`/app`, `/components`, `/lib`, `/types`)
- [ ] Configure ESLint and Prettier

#### 1.2 Database Setup
- [ ] Initialize Prisma with Supabase PostgreSQL
- [ ] Create database schema (Tool, Booking, User, Category, PaymentIntent models)
- [ ] Run initial migration
- [ ] Create seed script for categories
- [ ] Test database connection

#### 1.3 Authentication Setup
- [ ] Configure Supabase Auth client
- [ ] Create auth helpers and middleware
- [ ] Implement admin role checking
- [ ] Create protected route wrapper
- [ ] Test authentication flow

#### 1.4 External Service Integration
- [ ] Set up Stripe SDK and test keys
- [ ] Configure Resend email client
- [ ] Set up Igloohome API credentials (test environment)
- [ ] Configure Supabase Storage for images
- [ ] Create environment variable template

**Deliverable**: Working project skeleton with database and auth ready

---

### Phase 2: Core Tool Management 🔄 NEXT
**Goal**: Implement tool catalog, detail pages, and admin inventory management

#### 2.1 Database & Models
- [ ] Implement Prisma CRUD operations for tools
- [ ] Create tool validation schemas (Zod)
- [ ] Build category management utilities
- [ ] Create slug generation utility
- [ ] Test data access layer

#### 2.2 Tool Display (Public)
- [ ] Create tool detail page (`/tools/[slug]`)
  - Requirements: User Stories 1.1, 1.2
- [ ] Build tool catalog page (`/tools`)
  - Requirements: User Stories 4.1, 4.2
- [ ] Implement real-time search/filter
- [ ] Create tool card component
- [ ] Add category navigation
- [ ] Implement responsive image loading

#### 2.3 Admin Tool Management
- [ ] Create admin login page (`/admin/login`)
  - Requirements: User Story 5.1
- [ ] Build admin dashboard layout (`/admin`)
- [ ] Create "Add Tool" form with image upload
  - Requirements: User Story 5.2
- [ ] Build "Edit Tool" functionality
- [ ] Implement soft-delete with booking validation
- [ ] Create footer featured tools toggle
  - Requirements: User Story 5.6

**Deliverable**: Customers can browse tools; admins can manage inventory

---

### Phase 3: Booking & Payment System ⏸️ PENDING
**Goal**: Enable guest checkout, Stripe payments, and booking creation

#### 3.1 Availability Engine
- [ ] Build availability check API (`POST /api/tools/availability`)
  - Requirements: User Story 1.2 (AC 2-5)
- [ ] Create calendar component with date picker
- [ ] Implement booking conflict detection
- [ ] Add price calculation logic (rental fee + deposit)
- [ ] Test edge cases (same-day bookings, long-term rentals)

#### 3.2 Guest Checkout Flow
- [ ] Create checkout form component
  - Requirements: User Story 2.1
- [ ] Implement form validation (name, email, phone)
- [ ] Build payment intent creation API (`POST /api/create-payment-intent`)
- [ ] Integrate Stripe Elements for card collection
- [ ] Create booking confirmation page
- [ ] Add deposit breakdown display
  - Requirements: User Story 2.2

#### 3.3 Stripe Webhook Integration
- [ ] Set up webhook endpoint (`POST /api/webhooks/stripe`)
- [ ] Handle `payment_intent.succeeded` event
- [ ] Handle `payment_intent.payment_failed` event
- [ ] Implement webhook signature verification
- [ ] Create booking status update logic
- [ ] Add error logging and admin notifications

#### 3.4 Traffic Source Tracking
- [ ] Capture `?source=fb&listing_id={id}` parameters
  - Requirements: User Story 1.1 (AC 3)
- [ ] Store traffic source in booking record
- [ ] Create analytics helper functions

**Deliverable**: Customers can book tools and pay via Stripe

---

### Phase 4: Access Code Automation & Email Notifications ⏸️ PENDING
**Goal**: Integrate Igloohome smart lock codes and automated emails

#### 4.1 Igloohome Integration
- [ ] Create Igloohome API client wrapper
- [ ] Implement access code generation function
  - Requirements: User Story 3.1
- [ ] Add time-bound code creation (rental period)
- [ ] Store access codes in booking records
- [ ] Implement error handling for API failures
  - Requirements: User Story 3.1 (AC 5)
- [ ] Create manual code regeneration endpoint (`POST /api/admin/bookings/:id/regenerate-code`)
  - Requirements: User Story 5.4

#### 4.2 Email Notification System
- [ ] Create email templates with React Email
- [ ] Build booking confirmation email
  - Requirements: User Story 6.1
- [ ] Implement return reminder email (1 day before end date)
  - Requirements: User Story 6.2
- [ ] Create email sending service with Resend
- [ ] Add retry logic for failed sends
- [ ] Store email timestamps in database

#### 4.3 Post-Payment Workflow
- [ ] Connect Stripe webhook → Igloohome code generation
- [ ] Connect code generation → email sending
- [ ] Implement "Resend Code" functionality
- [ ] Handle `pending_code` status gracefully

**Deliverable**: Automated access code delivery via email after payment

---

### Phase 5: Admin Features & Analytics ⏸️ PENDING
**Goal**: Complete admin dashboard with booking management and reporting

#### 5.1 Booking Management Dashboard
- [ ] Create bookings list page (`/admin/bookings`)
  - Requirements: User Story 5.3
- [ ] Implement status filters (confirmed, pending_code, completed, cancelled)
- [ ] Add customer name/booking ID search
- [ ] Build booking detail view
- [ ] Create "Mark as Completed" action
- [ ] Add "Resend Email" button

#### 5.2 Analytics Dashboard
- [ ] Create analytics page (`/admin/analytics`)
  - Requirements: User Story 5.5
- [ ] Build metrics widgets:
  - Total bookings (current month)
  - Revenue (current month)
  - Top tools by bookings
  - Average rental duration
- [ ] Implement traffic source breakdown
- [ ] Add date range selector
- [ ] Create tool utilization chart

#### 5.3 User Management
- [ ] Create user list page (`/admin/users`)
  - Requirements: User Story 5.7
- [ ] Implement "Grant Admin Access" functionality
- [ ] Add role revocation
- [ ] Create audit trail logging

**Deliverable**: Full admin control panel with analytics

---

### Phase 6: Optional Customer Accounts & Polish ⏸️ PENDING
**Goal**: Add customer account features and final optimizations

#### 6.1 Customer Account System
- [ ] Create post-checkout account creation prompt
  - Requirements: User Story 7.1
- [ ] Build registration flow with email pre-fill
- [ ] Implement customer login page
- [ ] Create booking history page (`/account`)
  - Requirements: User Story 7.2
- [ ] Link guest bookings to new accounts

#### 6.2 Performance Optimization
- [ ] Optimize images with Next.js Image component
- [ ] Implement route prefetching
- [ ] Add database query optimization
- [ ] Test page load times (target: <2s on 4G)
  - Requirements: Non-Functional Performance

#### 6.3 Error Handling & Edge Cases
- [ ] Implement double booking prevention (database transactions)
- [ ] Add "Resend Access Code" lookup by email
- [ ] Create user-friendly error pages (404, 500)
- [ ] Test Igloohome downtime scenario
- [ ] Validate payment failure recovery

#### 6.4 Final QA & Testing
- [ ] Test complete booking flow end-to-end
- [ ] Verify all email templates
- [ ] Test admin workflows
- [ ] Validate mobile responsiveness
- [ ] Security audit (admin routes, payment flow)

**Deliverable**: Production-ready application

---

## Feature-to-Phase Mapping

| Feature | Primary Phase | User Stories |
|---------|---------------|--------------|
| Direct Tool Landing Pages | Phase 2 | 1.1, 1.2 |
| Guest Checkout with Stripe | Phase 3 | 2.1, 2.2 |
| Igloohome Access Codes | Phase 4 | 3.1, 3.2 |
| Tool Catalog & Discovery | Phase 2 | 4.1, 4.2 |
| Admin Dashboard | Phases 2, 5 | 5.1-5.7 |
| Email Notifications | Phase 4 | 6.1, 6.2 |
| Customer Accounts | Phase 6 | 7.1, 7.2 |

---

## External Dependencies Checklist

### Before Starting Development
- [ ] Obtain Igloohome API credentials (test + production)
- [ ] Create Stripe account and get API keys
- [ ] Set up Resend account and verify domain
- [ ] Create Supabase project and get connection strings
- [ ] Reserve domain name (if not already owned)

### During Development
- [ ] Configure Stripe webhook endpoint (after deploying Phase 3)
- [ ] Test Igloohome API with actual smart lock (Phase 4)
- [ ] Set up production database backups

---

## Deployment Strategy

### Staging Environment
1. Deploy to Vercel preview branch after each phase
2. Test with Stripe test mode
3. Use Igloohome sandbox environment
4. Validate all integrations before production

### Production Deployment
- **Timing**: After Phase 6 completion
- **Prerequisites**: All external services configured in production mode
- **Checklist**: See PRD "Post-Deployment Checklist" (lines 632-639)

---

## Risk Assessment & Mitigation

### High Priority Risks
1. **Igloohome API Reliability**
   - Risk: Service downtime prevents code generation
   - Mitigation: `pending_code` status + admin notification system

2. **Double Booking Race Condition**
   - Risk: Two customers book same dates simultaneously
   - Mitigation: Database transactions with row-level locking

3. **Stripe Webhook Failures**
   - Risk: Payment succeeds but webhook not received
   - Mitigation: Retry logic + manual reconciliation in admin dashboard

### Medium Priority Risks
1. **Email Delivery Failures**
   - Mitigation: 3-retry policy + admin notification

2. **Mobile Performance**
   - Mitigation: Dedicated mobile testing in Phase 6.2

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-08 | Use Prisma instead of Supabase SDK for data layer | Better type safety and migration management |
| 2025-12-08 | Implement guest checkout before customer accounts | Aligns with core value prop (minimize friction) |
| 2025-12-08 | Manual deposit refunds in V3 | Reduces complexity; automation deferred to V4 |

---

## Questions & Recommendations

### Questions for Clarification
1. **Igloohome Lock Configuration**: Do you already have physical smart locks installed? How many locks per location?
2. **Facebook Marketplace Integration**: Will you manually create FB listings with custom URLs, or need automation?
3. **Deposit Refund Timing**: What's the manual process for deposit refunds? (e.g., 48 hours after return?)
4. **Tool Categories**: Do you have a predefined list of categories, or should we start with common ones (Power Tools, Lawn Equipment, etc.)?
5. **Admin User Creation**: Should the first admin be created via Supabase dashboard, or build a setup wizard?

### Recommendations
1. **Start with Phase 1 Infrastructure**: Suggest tackling the foundation setup first to validate all external integrations work correctly.
2. **Prototype Igloohome Early**: If possible, test Igloohome API in Phase 1 to derisk the integration.
3. **Use React Email Templates**: Instead of plain HTML emails, use React Email for better maintainability.
4. **Add Monitoring**: Consider adding Sentry or similar for error tracking in production (Phase 6).
5. **Design System**: Use shadcn/ui components consistently for faster development and professional UI.
6. **Database Indexing**: Add indexes for `bookings.rental_start_date`, `bookings.rental_end_date`, and `tools.slug` for performance.

---

## Progress Tracking

**Current Status**: 🔴 Not Started
**Next Action**: Review questions above → Kick off Phase 1

### Phase Completion Status
- [ ] Phase 1: Foundation & Infrastructure (0%)
- [ ] Phase 2: Core Tool Management (0%)
- [ ] Phase 3: Booking & Payment System (0%)
- [ ] Phase 4: Access Code Automation (0%)
- [ ] Phase 5: Admin Features & Analytics (0%)
- [ ] Phase 6: Customer Accounts & Polish (0%)

---

**Legend**:
✅ Complete | 🔄 In Progress | ⏸️ Pending | ⏳ Current | 🔴 Blocked
