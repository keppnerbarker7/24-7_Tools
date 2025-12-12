# Utah Valley Tool Rental V3

A mobile-first tool rental platform optimized for Facebook Marketplace traffic with guest checkout, Stripe payments, and Igloohome smart lock integration.

---

## 🎯 Project Status

**Current Progress:**
- ✅ Phase 1: Foundation & Infrastructure (100%)
- ✅ Phase 2: Core Tool Management (100%)
- ⏳ Phase 3: Booking & Payment System (Next)

**What's Working:**
- Complete tool browsing experience (catalog, search, filters)
- Admin dashboard with full CRUD operations
- Secure authentication with role-based access
- Professional, mobile-responsive UI

---

## 🚀 Quick Start

### New Session? Start Here!

📖 **[START_HERE.md](./START_HERE.md)** - Your entry point for new sessions

### Running the Application

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Admin Access

**Login URL:** http://localhost:3000/login

For creating admin users, see [START_HERE.md](./START_HERE.md)

---

## 📚 Documentation

### Essential Reading
- **[START_HERE.md](./START_HERE.md)** - New session guide
- **[SESSION_SUMMARY.md](./SESSION_SUMMARY.md)** - Current session overview
- **[workflow/IMPLEMENTATION_NOTES.md](./workflow/IMPLEMENTATION_NOTES.md)** ⚠️ **CRITICAL** - Errors, fixes, and patterns

### Workflow Documentation
- **[workflow/README.md](./workflow/README.md)** - Documentation index
- **[workflow/WORKFLOW.md](./workflow/WORKFLOW.md)** - Progress tracker
- **[workflow/PHASE1_COMPLETE.md](./workflow/PHASE1_COMPLETE.md)** - Phase 1 details
- **[workflow/PHASE2_COMPLETE.md](./workflow/PHASE2_COMPLETE.md)** - Phase 2 details
- **[workflow/PHASE3_READY.md](./workflow/PHASE3_READY.md)** - Phase 3 guide

### Requirements
- **[requirements.md](./requirements.md)** - Original PRD

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (Supabase) + Prisma 7
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Email:** Resend
- **Smart Locks:** Igloohome API

---

## 📁 Project Structure

```
24:7_V3/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── login/             # Public login
│   ├── tools/             # Tool pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── tools/             # Public components
│   ├── admin/             # Admin components
│   └── auth/              # Auth components
├── lib/
│   ├── prisma.ts          # Database client
│   ├── tools.ts           # Tool operations
│   ├── auth.ts            # Auth helpers
│   └── client-utils.ts    # Client-safe utilities
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── types/
│   └── index.ts           # TypeScript types
├── workflow/              # 📚 Documentation
│   ├── README.md
│   ├── IMPLEMENTATION_NOTES.md  ⚠️ Critical
│   ├── PHASE1_COMPLETE.md
│   ├── PHASE2_COMPLETE.md
│   └── PHASE3_READY.md
├── START_HERE.md          # 🚀 New session guide
├── SESSION_SUMMARY.md     # Session overview
└── requirements.md        # Original PRD
```

---

## 🔧 Useful Commands

```bash
# Development
npm run dev                              # Start dev server

# Database
./node_modules/.bin/prisma migrate dev   # Create migration
./node_modules/.bin/prisma generate      # Generate Prisma Client
./node_modules/.bin/prisma studio        # Open database GUI
npm run db:seed                          # Seed database

# Stripe (Phase 3)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🎓 Key Features

### Public Features
- 🏠 Homepage with featured tools
- 🔍 Tool catalog with search and category filters
- 📄 Individual tool detail pages
- 📱 Mobile-responsive design
- 🎨 Professional UI with Tailwind CSS

### Admin Features
- 🔐 Secure authentication
- 📊 Dashboard with statistics
- ➕ Add/edit tools
- 🗑️ Soft delete with validation
- ⭐ Featured tools toggle
- 🖼️ Image management

### Coming in Phase 3
- 📅 Availability calendar
- 💳 Stripe payment integration
- 🛒 Guest checkout
- ✅ Booking confirmation

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🚨 Important Notes

Before starting any development work:

1. ✅ Read [START_HERE.md](./START_HERE.md)
2. ✅ Read [workflow/IMPLEMENTATION_NOTES.md](./workflow/IMPLEMENTATION_NOTES.md) - Contains critical error fixes and patterns
3. ✅ Understand the client vs server component boundaries
4. ✅ Never import Prisma in Client Components

---

## 📞 Support

For implementation questions, refer to:
- **[workflow/IMPLEMENTATION_NOTES.md](./workflow/IMPLEMENTATION_NOTES.md)** - Patterns and solutions
- **[workflow/PHASE3_READY.md](./workflow/PHASE3_READY.md)** - Phase 3 guide

---

**Last Updated:** December 9, 2025
**Status:** Phase 2 Complete ✅ - Ready for Phase 3
**Next Action:** Read [START_HERE.md](./START_HERE.md) to begin Phase 3
