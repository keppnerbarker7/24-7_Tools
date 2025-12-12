# Environment Variables Checklist for Vercel

Use this checklist when setting up environment variables in Vercel Dashboard.

---

## How to Add in Vercel

1. Go to your project in Vercel Dashboard
2. Settings > Environment Variables
3. Add each variable below
4. Select environments: **Production**, **Preview**, and **Development**
5. Click "Save"

---

## Required Variables

### 🗄️ Database (Supabase PostgreSQL)

| Variable | Example | Where to Get It | Notes |
|----------|---------|-----------------|-------|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase Dashboard > Project Settings > Database > Connection Pooling | Used at runtime for app queries |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-us-west-1.compute.amazonaws.com:5432/postgres` | Supabase Dashboard > Project Settings > Database > Direct Connection | Used by Prisma migrations |

**Steps to Get:**
- [ ] Log into Supabase
- [ ] Go to Project Settings > Database
- [ ] Copy "Connection Pooling" string for `DATABASE_URL`
- [ ] Copy "Direct Connection" string for `DIRECT_URL`
- [ ] Replace `[YOUR-PASSWORD]` with your database password

---

### 🔐 Supabase Auth & Storage

| Variable | Example | Where to Get It | Notes |
|----------|---------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefgh.supabase.co` | Supabase Dashboard > Project Settings > API > Project URL | Public - safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard > Project Settings > API > anon public | Public - safe for client |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard > Project Settings > API > service_role | **Secret** - server only |

**Steps to Get:**
- [ ] Log into Supabase
- [ ] Go to Project Settings > API
- [ ] Copy Project URL
- [ ] Copy `anon` `public` key
- [ ] Copy `service_role` `secret` key

---

### 💳 Stripe Payment Processing

| Variable | Example | Where to Get It | Notes |
|----------|---------|-----------------|-------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Stripe Dashboard > Developers > API Keys | Public - safe for client |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Stripe Dashboard > Developers > API Keys | **Secret** - server only |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard > Developers > Webhooks | Add after creating webhook |

**Steps to Get:**
- [ ] Log into Stripe Dashboard
- [ ] Go to Developers > API Keys
- [ ] Copy Publishable key (use test mode initially)
- [ ] Copy Secret key (use test mode initially)
- [ ] **After deployment:** Set up webhook (see below)

**Webhook Setup (Do AFTER first deployment):**
- [ ] Go to Stripe > Developers > Webhooks
- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
- [ ] Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- [ ] Copy webhook signing secret
- [ ] Add as `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Redeploy

---

### 🔒 Igloohome Smart Lock API

| Variable | Example | Where to Get It | Notes |
|----------|---------|-----------------|-------|
| `IGLOOHOME_API_KEY` | `your_api_key_here` | Igloohome Developer Portal | Contact support if needed |
| `IGLOOHOME_API_SECRET` | `your_api_secret_here` | Igloohome Developer Portal | **Secret** - server only |
| `IGLOOHOME_BASE_URL` | `https://api.igloohome.co` | Documentation | Production API URL |
| `IGLOOHOME_LOCK_ID` | `your_lock_id_here` | Igloohome App or API | Your physical lock ID |

**Steps to Get:**
- [ ] Sign up at https://developer.igloohome.co
- [ ] Request API access (may need business verification)
- [ ] Generate API credentials
- [ ] Get lock ID from Igloohome mobile app

**Note:** If you don't have Igloohome access yet, you can deploy without these and add them later when Phase 3 is implemented.

---

### 📧 Resend Email Service

| Variable | Example | Where to Get It | Notes |
|----------|---------|-----------------|-------|
| `RESEND_API_KEY` | `re_...` | Resend Dashboard > API Keys | **Secret** - server only |
| `RESEND_FROM_EMAIL` | `bookings@utahvalleytoolrental.com` | Your verified domain in Resend | Must be verified domain |

**Steps to Get:**
- [ ] Sign up at https://resend.com
- [ ] Verify your domain (or use `onboarding@resend.dev` for testing)
- [ ] Go to API Keys
- [ ] Create and copy API key

**Domain Verification:**
- [ ] Add your domain in Resend Dashboard
- [ ] Add DNS records to your domain registrar
- [ ] Wait for verification (usually a few minutes)
- [ ] Or use `onboarding@resend.dev` for testing (no verification needed)

---

### 🌐 Application Configuration

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | **Update after first deployment** |
| `BUSINESS_NAME` | `Utah Valley Tool Rental` | Displayed in emails and footer |
| `BUSINESS_LOCATION` | `123 Main St, Provo, UT 84601` | Update with actual address |
| `BUSINESS_PHONE` | `+1234567890` | E.164 format: `+1...` |
| `BUSINESS_EMAIL` | `info@utahvalleytoolrental.com` | Customer service email |
| `TZ` | `America/Denver` | Timezone for rental periods |

**Steps:**
- [ ] Initially set `NEXT_PUBLIC_APP_URL` to `http://localhost:3000`
- [ ] After first deployment, update with your Vercel URL
- [ ] Update business details with actual information

---

## Environment Selection

When adding each variable in Vercel, select:

- ✅ **Production** - Live environment
- ✅ **Preview** - Pull request previews
- ✅ **Development** - Local development (if using Vercel CLI)

Most variables should be set for **all three environments**.

---

## Variables Summary Count

Total variables to add: **17**

**Required for initial deployment:** 14
- Database: 2
- Supabase: 3
- Stripe: 2 (webhook secret added later)
- Resend: 2
- App Config: 6

**Optional/Add Later:** 4
- Igloohome: 4 (only needed for Phase 3 smart lock integration)

---

## Quick Copy-Paste Template

Use this template to prepare all your values before adding to Vercel:

```bash
# Database
DATABASE_URL=""
DIRECT_URL=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET="" # Add after webhook setup

# Igloohome (optional for now)
IGLOOHOME_API_KEY=""
IGLOOHOME_API_SECRET=""
IGLOOHOME_BASE_URL="https://api.igloohome.co"
IGLOOHOME_LOCK_ID=""

# Resend
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""

# App Config
NEXT_PUBLIC_APP_URL="" # Update after deployment
BUSINESS_NAME="Utah Valley Tool Rental"
BUSINESS_LOCATION="123 Main St, Provo, UT 84601"
BUSINESS_PHONE="+1234567890"
BUSINESS_EMAIL="info@utahvalleytoolrental.com"
TZ="America/Denver"
```

---

## Verification Checklist

After adding all variables:

- [ ] All 14-17 variables added in Vercel
- [ ] Each variable set for Production, Preview, and Development
- [ ] Database URLs are connection pooling and direct URLs
- [ ] `NEXT_PUBLIC_*` variables are correctly prefixed
- [ ] Secrets (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are server-only
- [ ] No typos in variable names (they're case-sensitive!)
- [ ] Ready to deploy

---

## Post-Deployment Updates

After first deployment, update these variables:

1. **`NEXT_PUBLIC_APP_URL`**
   - Change from `http://localhost:3000`
   - To your Vercel URL: `https://your-app.vercel.app`
   - Or custom domain: `https://utahvalleytoolrental.com`

2. **`STRIPE_WEBHOOK_SECRET`**
   - Set up webhook endpoint in Stripe
   - Add webhook signing secret

3. **Redeploy** after updating variables

---

## Security Notes

🔒 **Never commit these to Git:**
- All `.env` files are in `.gitignore`
- Secrets are only in Vercel Dashboard
- Never share service role keys or secret keys

🔐 **Client vs Server:**
- `NEXT_PUBLIC_*` = Safe for browser (public)
- Everything else = Server-only (secret)

---

**Last Updated:** December 12, 2024
**Status:** Ready for Configuration
