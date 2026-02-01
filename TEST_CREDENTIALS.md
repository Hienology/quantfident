# 🔐 Test Credentials for Local Development

## Admin Account (Full Access)
```
Email:    tribd.tec@gmail.com
Password: AdminTest123!@
Role:     admin
```

**Access:**
- Login form at `http://localhost:3000` (click "Đăng nhập")
- Admin dashboard at `http://localhost:3000/admin/blog`
- Can create, edit, delete blog posts

---

## Test User Account (Limited Access)
```
Email:    test@example.com
Password: password123
Role:     user
```

**Access:**
- Login form at `http://localhost:3000`
- Can view published blog posts
- Cannot access admin features

---

## Testing URLs

### Public Pages
- Homepage: `http://localhost:3000`
- Blog Section: `http://localhost:3000#blog` (scroll down on homepage)
- Privacy: `http://localhost:3000/privacy`
- Terms: `http://localhost:3000/terms`

### Authentication
- Login/Signup Modal: Click "Đăng nhập" button (http://localhost:3000)

### Admin Dashboard
- Admin Blog: `http://localhost:3000/admin/blog`
- Create Post: Click "New Post" button in admin dashboard
- Edit Post: Click edit icon on any post row

---

## API Endpoints (for curl testing)

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tribd.tec@gmail.com",
    "password": "AdminTest123!@"
  }'
```

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "StrongPass123!@",
    "name": "New User"
  }'
```

### Get Blog Posts
```bash
curl http://localhost:3000/api/blog
```

---

## Features to Test

### ✅ Login/Auth UI
- [ ] Click "Đăng nhập" → Modal opens
- [ ] Switch between Login ↔ Register tabs
- [ ] Login with admin credentials
- [ ] See error message with wrong credentials
- [ ] See success message with correct credentials

### ✅ Admin Dashboard
- [ ] Visit `/admin/blog` as admin
- [ ] See stats cards (Total, Published, Drafts, This Month)
- [ ] See empty posts table initially
- [ ] Search box functional
- [ ] Category filter dropdown

### ✅ Blog Editor (after DB setup)
- [ ] Click "New Post" button
- [ ] Fill in title
- [ ] Write content in rich text editor
- [ ] Add tags (comma-separated)
- [ ] Select category
- [ ] Set featured image URL
- [ ] Toggle status (Draft/Published)
- [ ] Save post

### ✅ Blog Listing
- [ ] Scroll to Blog section on homepage
- [ ] See pagination controls
- [ ] Search posts
- [ ] Filter by category
- [ ] Click "Read More" to view individual posts

---

## Notes

- **Mock Authentication**: Currently uses mock API, not Firebase
- **No Database**: Blog posts won't persist without DATABASE_URL
- **Firebase Disabled**: Firebase auth not configured for local testing
- **Session Storage**: Use localStorage for mock session persistence

For production auth and database, ensure:
1. Firebase credentials in `.env.local`
2. DATABASE_URL configured
3. ADMIN_EMAIL set on Vercel

---

## Troubleshooting

### Login not working?
- Check email and password exactly match above
- Make sure you're using the mock credentials (not real Firebase)

### Admin dashboard blank?
- This is expected - database not connected
- Check browser console for errors

### Blog posts not saving?
- DATABASE_URL is not set
- This is expected in local dev without database setup
