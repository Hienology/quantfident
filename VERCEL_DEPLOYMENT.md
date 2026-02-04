# Vercel Deployment Instructions

## Quick Start

To deploy Quantfident to Vercel:

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Your Project
```bash
cd /workspaces/quantfident
vercel link
```

### 4. Deploy to Production
```bash
vercel --prod
```

## Setting Up Environment Variables on Vercel

Once your project is linked, you can set environment variables:

### Option A: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

#### Database
- **DATABASE_URL**: `postgresql://username:password@host:5432/dbname`

#### Firebase Public Config (Client-side)
- **NEXT_PUBLIC_FIREBASE_API_KEY**: Your Firebase API key
- **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**: `your-project.firebaseapp.com`
- **NEXT_PUBLIC_FIREBASE_PROJECT_ID**: Your Firebase project ID
- **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**: `your-project.appspot.com`
- **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**: Your messaging sender ID
- **NEXT_PUBLIC_FIREBASE_APP_ID**: Your Firebase app ID
- **NEXT_PUBLIC_SITE_URL**: `https://your-domain.vercel.app`

#### Firebase Admin SDK (Server-side)
- **FIREBASE_PROJECT_ID**: Your Firebase project ID
- **FIREBASE_CLIENT_EMAIL**: Service account email from Firebase
- **FIREBASE_PRIVATE_KEY**: Private key from Firebase service account

### Option B: Via Vercel CLI
```bash
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# ... add all other variables

# Then redeploy
vercel --prod
```

## Deployment Status

After setting environment variables, redeploy:

```bash
vercel --prod
```

The deployment URL will be displayed in your terminal and will be available at:
- `https://quantfident.vercel.app` (or your custom domain)

## Monitoring

Once deployed, monitor your deployment at:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Logs**: Click on your project → Deployments → Recent deployment → Logs
- **Analytics**: See Core Web Vitals and performance metrics

## Rollback

If needed, rollback to a previous deployment:
```bash
vercel rollback
```

## Custom Domain

To add a custom domain:
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Notes

- GitHub integration is recommended for automatic deployments on push
- Environment variables are automatically loaded by Next.js
- Vercel automatically handles HTTPS and SSL certificates
- Build time typically 2-5 minutes
- Deployments are atomic (either fully deployed or rolled back)
