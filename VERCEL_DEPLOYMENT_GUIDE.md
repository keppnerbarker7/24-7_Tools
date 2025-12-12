# Vercel Deployment Guide - Utah Valley Tool Rental V3

## Prerequisites Checklist

Before deploying to Vercel, ensure you have:

- [x] GitHub repository connected: https://github.com/keppnerbarker7/24-7_Tools.git
- [ ] Vercel account created at https://vercel.com
- [ ] Supabase project set up with PostgreSQL database
- [ ] Stripe account (test mode is fine initially)
- [ ] Resend account with verified domain
- [ ] Igloohome developer account with API credentials

---

## Deployment Steps

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your GitHub repository: `keppnerbarker7/24-7_Tools`
4. Vercel will auto-detect Next.js framework

### Step 2: Configure Build Settings

Vercel should auto-detect these settings (already configured in `vercel.json`):

- **Framework Preset:** Next.js
- **Build Command:** `vercel-build` (uses our custom script)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 3: Configure Environment Variables

Add all environment variables in Vercel Dashboard > Settings > Environment Variables.

#### Critical Database Variables
```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.compute.amazonaws.com:5432/postgres"
```

#### Supabase Auth & Storage
```bash
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Stripe Payment Processing
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="" # Leave blank initially, add after webhook setup
```

#### Igloohome Smart Lock API
```bash
IGLOOHOME_API_KEY="your_api_key_here"
IGLOOHOME_API_SECRET="your_api_secret_here"
IGLOOHOME_BASE_URL="https://api.igloohome.co"
IGLOOHOME_LOCK_ID="your_lock_id_here"
```

#### Resend Email Service
```bash
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="bookings@utahvalleytoolrental.com"
```

#### Application Configuration
```bash
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app" # Update with your Vercel URL
BUSINESS_NAME="Utah Valley Tool Rental"
BUSINESS_LOCATION="123 Main St, Provo, UT 84601"
BUSINESS_PHONE="+1234567890"
BUSINESS_EMAIL="info@utahvalleytoolrental.com"
TZ="America/Denver"
```

**Important:** Set all variables for "Production", "Preview", and "Development" environments.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will run:
   - `npm install`
   - `prisma generate` (via postinstall)
   - `prisma migrate deploy` (via vercel-build)
   - `next build`

### Step 5: Post-Deployment Configuration

#### A. Update App URL
1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` environment variable
3. Redeploy (Vercel > Deployments > three dots > Redeploy)

#### B. Configure Stripe Webhook
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the webhook signing secret
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
6. Redeploy

#### C. Configure Supabase Auth Redirect
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add site URL: `https://your-app.vercel.app`
3. Add redirect URLs:
   - `https://your-app.vercel.app/login`
   - `https://your-app.vercel.app/admin`

#### D. Verify Resend Domain
1. Go to Resend Dashboard > Domains
2. Add your domain or use `onboarding@resend.dev` for testing
3. Update `RESEND_FROM_EMAIL` if needed

### Step 6: Database Setup

Your database should already be set up from local development, but if starting fresh:

```bash
# Run migrations (should happen automatically via vercel-build)
npx prisma migrate deploy

# Seed database (optional, run locally and data will be in Supabase)
npm run db:seed
```

### Step 7: Create Admin User

**Option 1: Via Supabase Dashboard**
1. Go to Supabase > Authentication > Users
2. Add user manually
3. Go to Table Editor > users table
4. Set `role` field to `"admin"`

**Option 2: Via Supabase SQL Editor**
```sql
-- Insert admin user
INSERT INTO users (id, email, role, created_at)
VALUES (
  'user-id-from-auth',  -- Get this from Authentication > Users
  'admin@utahvalleytoolrental.com',
  'admin',
  NOW()
);
```

### Step 8: Test Your Deployment

Visit your Vercel URL and test:

- [ ] Homepage loads with featured tools
- [ ] Tool catalog displays correctly
- [ ] Search and filters work
- [ ] Individual tool pages load
- [ ] Admin login at `/login`
- [ ] Admin dashboard accessible
- [ ] Tool CRUD operations work
- [ ] Images load from Supabase storage

---

## Troubleshooting

### Build Fails with Prisma Error

**Error:** `Prisma Client not generated`

**Solution:**
```bash
# Ensure postinstall script runs
# Check package.json has: "postinstall": "prisma generate"
```

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check Supabase project is running
- Ensure IP allowlist in Supabase allows all IPs (`0.0.0.0/0`)

### Environment Variables Not Working

**Error:** `process.env.VARIABLE_NAME is undefined`

**Solution:**
- Ensure variables are set in all environments (Production, Preview, Development)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)
- Client-side variables must start with `NEXT_PUBLIC_`

### Stripe Webhook Failures

**Error:** `Webhook signature verification failed`

**Solution:**
- Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Webhook URL must be exact: `https://your-app.vercel.app/api/webhooks/stripe`
- Redeploy after adding webhook secret

### Images Not Loading

**Error:** `Image optimization error`

**Solution:**
- Check `next.config.ts` includes Supabase domain in `remotePatterns`
- Verify images exist in Supabase Storage
- Check Supabase storage bucket is public

### Prisma Migration Issues

**Error:** `Migration failed to apply`

**Solution:**
```bash
# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Or apply specific migration
npx prisma migrate deploy
```

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Test all public pages (home, catalog, tool details)
- [ ] Test admin authentication
- [ ] Test admin CRUD operations
- [ ] Verify images load correctly
- [ ] Test responsive design on mobile
- [ ] Check browser console for errors
- [ ] Test database connections
- [ ] Verify environment variables are working
- [ ] Set up Stripe webhook
- [ ] Update `NEXT_PUBLIC_APP_URL` with production URL
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics (optional)

---

## Custom Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel Dashboard > Settings > Domains
2. Add your domain (e.g., `utahvalleytoolrental.com`)
3. Follow DNS configuration instructions
4. Update these environment variables:
   - `NEXT_PUBLIC_APP_URL="https://utahvalleytoolrental.com"`
   - `RESEND_FROM_EMAIL="bookings@utahvalleytoolrental.com"`
5. Update Stripe webhook URL
6. Update Supabase redirect URLs
7. Redeploy

---

## Monitoring & Maintenance

### View Logs
- Vercel Dashboard > Deployments > View Function Logs
- Check for errors in real-time

### Rollback Deployment
- Vercel Dashboard > Deployments
- Find previous working deployment
- Click three dots > Promote to Production

### Update Environment Variables
1. Vercel Dashboard > Settings > Environment Variables
2. Edit variable
3. Redeploy for changes to take effect

---

## Performance Optimization

Vercel automatically provides:
- ✅ Edge CDN caching
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 & HTTP/3 support

Monitor performance:
- Vercel Analytics (enable in dashboard)
- Vercel Speed Insights
- Core Web Vitals

---

## Security Checklist

- [x] `.env` files in `.gitignore`
- [x] Server-only secrets not exposed to client
- [x] Supabase Row Level Security enabled
- [ ] Rate limiting on API routes (consider adding)
- [ ] CORS configured properly
- [ ] Input validation on all forms
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

---

## Next Steps

After deployment is stable:

1. **Phase 3 Implementation:** Booking & payment system
2. **Testing:** Comprehensive end-to-end testing
3. **Marketing:** Facebook Marketplace integration
4. **Monitoring:** Set up error tracking (Sentry)
5. **Analytics:** Google Analytics or Vercel Analytics
6. **Backups:** Automated database backups via Supabase
7. **Documentation:** User guide for customers

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma with Vercel:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Supabase with Vercel:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

**Last Updated:** December 12, 2024
**Status:** Ready for Deployment
**Repository:** https://github.com/keppnerbarker7/24-7_Tools.git
