# Quick Deploy to Vercel - 5 Minute Guide

## 🚀 Deploy in 3 Steps

### Step 1: Import to Vercel (1 min)
1. Go to https://vercel.com/new
2. Import: `keppnerbarker7/24-7_Tools`
3. Auto-detects Next.js ✅

### Step 2: Add Environment Variables (3 min)
Copy from your local `.env.local` file:

**Database (2 vars)**
```
DATABASE_URL=postgresql://...pooler...
DIRECT_URL=postgresql://...compute...
```

**Supabase (3 vars)**
```
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

**Stripe (2 vars)**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Resend (2 vars)**
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=bookings@yourdomain.com
```

**App Config (6 vars)**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
BUSINESS_NAME=Utah Valley Tool Rental
BUSINESS_LOCATION=123 Main St, Provo, UT 84601
BUSINESS_PHONE=+1234567890
BUSINESS_EMAIL=info@utahvalleytoolrental.com
TZ=America/Denver
```

**Set all for:** Production, Preview, Development ✅

### Step 3: Deploy (1 min)
1. Click "Deploy"
2. Wait 2-3 minutes
3. ✅ Live!

---

## After First Deployment

1. Copy your Vercel URL: `https://your-app.vercel.app`
2. Update `NEXT_PUBLIC_APP_URL` in Vercel settings
3. Redeploy

---

## Need More Help?

- **Full Guide:** [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)
- **All Variables:** [ENV_VARIABLES_CHECKLIST.md](ENV_VARIABLES_CHECKLIST.md)
- **Summary:** [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

---

**That's it!** Your app will be live at `https://your-app.vercel.app` 🎉
