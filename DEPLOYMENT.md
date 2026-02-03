# Deployment Guide for Quantfident

## ✅ Pre-Deployment Checklist

### Dependencies Status
- ✅ All npm packages installed (43 packages)
- ✅ Node.js and npm versions compatible
- ✅ Build completed successfully
- ✅ Production server tested locally

### Build Information
- **Build Size**: ~233MB (.next directory)
- **Build Time**: ~47 seconds
- **Routes**: 14 routes generated
- **Build Tool**: Next.js 15.5.9 with Turbopack

## 🔧 Environment Variables Required

Before deploying, configure these environment variables in your hosting platform:

### Database
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### Firebase Admin (Server-side)
```bash
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
Vercel is the native platform for Next.js apps.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required variables from above
   - Or use CLI:
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
   # ... add all other variables
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile** (if not exists)
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t quantfident .
   docker run -p 3000:3000 --env-file .env quantfident
   ```

### Option 3: Traditional VPS/Server

1. **Setup Node.js on server**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd quantfident
   npm install
   npm run build
   ```

3. **Create .env file with your variables**
   ```bash
   nano .env
   # Add all environment variables
   ```

4. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "quantfident" -- start
   pm2 save
   pm2 startup
   ```

## ⚠️ Known Issues & Warnings

### Build Warnings
The build completes successfully but has these non-critical warnings:
- Unused imports in several files (no impact on functionality)
- Using `<img>` instead of Next.js `<Image>` component (may affect performance)
- DATABASE_URL required for static generation of blog posts

### Runtime Warnings
- Firebase configuration check runs at startup (expected if not configured)
- Database connection needed for blog functionality

## 🧪 Testing Deployment

### Local Production Test
```bash
# Build
npm run build

# Test production server
DATABASE_URL="postgresql://..." PORT=3001 npm start
```

### Verify Routes
- Homepage: `http://localhost:3001/`
- Blog: `http://localhost:3001/blog/[slug]`
- Admin: `http://localhost:3001/admin/blog`
- API: `http://localhost:3001/api/auth/login`

## 📊 Deployment Workflow Status

✅ **GitHub Actions CI** is configured:
- Runs on push to `main` and `develop` branches
- Checks linting
- Builds project
- Located at: `.github/workflows/ci.yml`

## 🔒 Security Checklist

Before deploying to production:
- [ ] Set all environment variables securely (never commit .env)
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Configure Firebase security rules
- [ ] Set up PostgreSQL with strong password
- [ ] Review and restrict API routes access
- [ ] Enable rate limiting if needed

## 📈 Post-Deployment

1. **Monitor**: Check Vercel Analytics/logs for errors
2. **Test**: Verify all routes work correctly
3. **Database**: Run Prisma migrations if needed
   ```bash
   npx prisma migrate deploy
   ```
4. **Firebase**: Test authentication flow
5. **Performance**: Check Core Web Vitals

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (requires v20+)
- Verify all dependencies installed: `npm install`
- Clear cache: `rm -rf .next node_modules && npm install`

### Runtime Errors
- Verify DATABASE_URL is set correctly
- Check Firebase credentials are valid
- Ensure all NEXT_PUBLIC_* variables are set

### Database Connection Issues
- Verify PostgreSQL is accessible from deployment environment
- Check connection string format
- Run `npx prisma generate` after schema changes

## 📝 Notes

- First deployment tested: February 3, 2026
- Build size: ~233MB
- Dependencies: 43 packages
- Node version: 20.x
- Next.js version: 15.5.9
