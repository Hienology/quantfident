# Admin Account Setup Guide

## Create Admin Account in Firebase

### Prerequisites
- Firebase credentials in your local `.env.local`
- Dev server running locally

### Steps:

1. **On your local machine** (where .env.local exists):
   ```bash
   npm run dev
   ```

2. **Open browser** to http://localhost:3000

3. **Register your admin account**:
   - Click "Sign Up" or navigate to registration
   - Email: `tribd.tec@gmail.com`
   - Password: Choose a secure password (save it securely!)
   - Name: Your name

4. **Verify in Firebase Console**:
   - Go to https://console.firebase.google.com/
   - Select your project
   - Navigate to Authentication → Users
   - Confirm `tribd.tec@gmail.com` is listed

5. **Test admin access**:
   - Log in with your credentials
   - Navigate to `/admin/blog`
   - You should see the blog dashboard

### Important Notes:
- The ADMIN_EMAIL environment variable (`tribd.tec@gmail.com`) grants admin role
- Any user with this email in Firebase Auth will have admin permissions
- After registration, add ADMIN_EMAIL to Vercel environment variables

### Security Checklist:
- ✅ Use a strong password (12+ characters, mixed case, numbers, symbols)
- ✅ Save password in a secure password manager
- ✅ Never commit passwords to git
- ✅ Don't share credentials in plain text

## After Account Creation:

### Deploy to Vercel:
1. Authenticate Vercel CLI (if not done):
   ```bash
   vercel login
   # Enter device code: XHTD-GSFB at vercel.com/device
   ```

2. Add environment variables:
   ```bash
   vercel env add ADMIN_EMAIL
   # Enter value: tribd.tec@gmail.com
   ```

3. Add all Firebase credentials:
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
   # ... etc
   ```

4. Deploy:
   ```bash
   git push origin main
   # Or manually: vercel --prod
   ```

### Verify Production:
- Visit your Vercel deployment URL
- Log in with `tribd.tec@gmail.com` and your password
- Test `/admin/blog` access
