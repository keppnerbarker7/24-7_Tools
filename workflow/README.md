# Workflow Documentation

This folder contains all workflow and implementation documentation for the Utah Valley Tool Rental V3 project.

---

## 📚 Documentation Index

### 🎯 Start Here

**If you're starting a new session or Phase 3, read these in order:**

1. **[IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md)** ⚠️ **CRITICAL - READ FIRST**
   - All errors encountered and their fixes
   - Architectural decisions explained
   - Client vs Server component patterns
   - Common pitfalls to avoid
   - Phase 3 preparation guide

### 📋 Current Status

2. **[WORKFLOW.md](./WORKFLOW.md)**
   - High-level workflow overview
   - Current progress tracking
   - Phase completion status

### ✅ Completed Phases

3. **[PHASE1_COMPLETE.md](./PHASE1_COMPLETE.md)**
   - Foundation & Infrastructure details
   - Database schema setup
   - Authentication configuration
   - Environment variables
   - File structure created

4. **[PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md)**
   - Tool management implementation
   - Public pages (homepage, catalog, detail)
   - Admin dashboard and CRUD operations
   - Testing checklist
   - Known limitations

### 🚀 Next Phase

5. **[PHASE3_READY.md](./PHASE3_READY.md)**
   - Phase 3 preparation guide
   - Implementation checklist
   - Critical patterns and code examples
   - Testing strategy
   - Dependencies to install

---

## 🔍 Quick Reference

### Current Status (as of Dec 9, 2025)
- ✅ Phase 1: Foundation & Infrastructure (100%)
- ✅ Phase 2: Core Tool Management (100%)
- ⏳ Phase 3: Booking & Payment System (0%) - NEXT

### What's Working
- Complete tool browsing (catalog, search, filter, detail pages)
- Admin authentication with role-based access
- Full tool CRUD operations (create, read, update, soft delete)
- Featured tools toggle
- Database with Prisma + Supabase
- Tailwind CSS styling

### What's Next (Phase 3)
- Availability calendar
- Guest checkout flow
- Stripe payment integration
- Booking creation
- Stripe webhook handling
- Confirmation page

---

## 🎓 Key Lessons Learned

### Critical Errors Fixed in Phases 1 & 2

1. **Tailwind CSS v4 PostCSS Plugin**
   - Use `@tailwindcss/postcss` not `tailwindcss` directly

2. **Admin Login Redirect Loop**
   - Never put auth pages inside protected directories
   - Use single `/login` with role-based redirects

3. **Supabase Auth vs Database Confusion**
   - Passwords stored in Supabase Auth (separate from database)
   - User profiles stored in database with role

4. **Prisma Client-Side Import (fs module error)**
   - Never import Prisma in Client Components
   - Create `lib/client-utils.ts` for client-safe functions

### Architectural Patterns Established

- **Soft Delete**: Use `isActive` flag, not hard deletes
- **Prisma Decimals**: Convert to numbers in data access layer
- **Server Components**: Default unless hooks/interactions needed
- **Client Components**: Only when using useState, forms, etc.
- **API Routes**: Use for all database operations from client

---

## 📖 How to Use This Documentation

### Starting a New Session

1. Read [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) - especially the sections on:
   - Client vs Server component boundaries
   - Critical errors and fixes
   - Database best practices

2. Check [WORKFLOW.md](./WORKFLOW.md) for current progress

3. If starting Phase 3, read [PHASE3_READY.md](./PHASE3_READY.md)

### During Development

- Reference IMPLEMENTATION_NOTES.md for patterns and pitfalls
- Update WORKFLOW.md progress as you complete tasks
- Document any new errors/fixes in appropriate files

### After Completing a Phase

- Create `PHASE{N}_COMPLETE.md` documenting what was accomplished
- Update WORKFLOW.md with completion status
- Create `PHASE{N+1}_READY.md` for next phase

---

## 🏗️ Project Structure Reference

```
24:7_V3/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Homepage with featured tools
│   ├── login/             # Public login (role-based redirect)
│   ├── tools/             # Public tool pages
│   ├── admin/             # Protected admin area
│   └── api/               # API routes
├── components/
│   ├── tools/             # Public tool components
│   ├── admin/             # Admin dashboard components
│   └── booking/           # Booking flow components (Phase 3)
├── lib/
│   ├── prisma.ts          # Database client
│   ├── tools.ts           # Tool operations (server-side)
│   ├── categories.ts      # Category operations
│   ├── auth.ts            # Auth helpers
│   ├── client-utils.ts    # Client-safe utilities
│   ├── supabase/          # Supabase clients
│   └── stripe/            # Stripe clients
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seed script
│   └── migrations/        # Database migrations
├── types/
│   └── index.ts           # TypeScript types
├── workflow/              # 📍 You are here
│   ├── README.md          # This file
│   ├── WORKFLOW.md        # High-level workflow
│   ├── IMPLEMENTATION_NOTES.md  # Critical reference
│   ├── PHASE1_COMPLETE.md
│   ├── PHASE2_COMPLETE.md
│   └── PHASE3_READY.md
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

# Stripe (for Phase 3)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Git
git status                               # Check changes
git add .                                # Stage all changes
git commit -m "message"                  # Commit changes
```

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ✅ Pre-Flight Checklist for Phase 3

Before starting Phase 3, ensure:

- [ ] Read IMPLEMENTATION_NOTES.md thoroughly
- [ ] Reviewed Phase 2 completion documentation
- [ ] Understand client vs server component boundaries
- [ ] Stripe test keys are configured in .env.local
- [ ] Install Phase 3 dependencies: `npm install @stripe/react-stripe-js @stripe/stripe-js`
- [ ] Set up Stripe CLI for webhook testing
- [ ] Server is running: `npm run dev`
- [ ] Database is seeded with test data

---

**Last Updated**: December 9, 2025
**Current Phase**: Phase 3 - Booking & Payment System
**Status**: Ready to Begin 🚀
