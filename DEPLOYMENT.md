# ColegioSync - Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/joseluishuenuman/cr-app
npm install
```

### 2. Create D1 Database

```bash
wrangler d1 create colegiosync-db
```

**Copy the `database_id` from the output and update `wrangler.toml`:**

```toml
[[d1_databases]]
binding = "DB"
database_name = "colegiosync-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

### 3. Apply Database Schema and Seed Data

```bash
npm run db:schema
npm run db:seed
```

### 4. Generate VAPID Keys for Push Notifications

```bash
npx web-push generate-vapid-keys
```

This will output:
```
Public Key: <your-public-key>
Private Key: <your-private-key>
```

### 5. Configure Secrets

```bash
# JWT Secret (generate a random string)
wrangler secret put JWT_SECRET
# Enter a secure random string like: super-secret-jwt-key-2024

# VAPID Keys
wrangler secret put VAPID_PUBLIC_KEY
# Paste the public key from step 4

wrangler secret put VAPID_PRIVATE_KEY
# Paste the private key from step 4
```

### 6. Test Locally

```bash
npm run dev
```

Open http://localhost:8787 and test with:
- **Admin**: admin@colegio.com / admin123
- **Coordinador**: coordinador@colegio.com / coord123
- **Padre**: padre@test.com / padre123

### 7. Deploy to Production

```bash
npm run deploy
```

Your app will be live at: `https://colegiosync.YOUR_SUBDOMAIN.workers.dev`

---

## 🔧 Troubleshooting

### Database Issues

If you need to reset the database:
```bash
npm run db:reset
```

### View Database Contents

```bash
wrangler d1 execute colegiosync-db --command "SELECT * FROM users;"
wrangler d1 execute colegiosync-db --command "SELECT * FROM events;"
```

### Local Development with Remote Database

```bash
wrangler dev --remote
```

---

## 📋 Current Implementation Status

### ✅ Implemented (MVP)
- Backend API with all routes (auth, courses, events, subscriptions, materials, push)
- JWT authentication with httpOnly cookies
- Database schema with 9 tables
- Frontend with Preact + TailwindCSS
- Login page with test credentials
- Dashboard with today/week view
- Event detail modal
- Profile page with notification preferences
- PWA manifest and Service Worker
- Offline support
- Icons generated

### 🚧 To Do (Post-MVP)
- Calendar monthly view page
- Materials list page
- Course subscription page for parents
- Admin course management page
- Coordinator event management page
- Event form component
- Material checkbox functionality
- Push notification scheduling (requires Cron Triggers)
- Additional pages and features from original spec

---

## 🎯 Testing the MVP

1. **Test Authentication**:
   - Login as padre@test.com / padre123
   - Verify dashboard loads
   - Check profile page works
   - Logout and login again

2. **Test Events**:
   - Click "Esta Semana" to see all week events
   - Click an event card to see details
   - Test "Agregar al calendario" button (downloads .ics file)

3. **Test PWA**:
   - Open in Chrome mobile or desktop
   - Check for "Install App" option
   - Install and verify it opens in standalone mode
   - Go offline and verify offline page appears

4. **Test Notification Preferences**:
   - Go to Profile
   - Toggle notification settings
   - Save preferences
   - Verify they persist after reload

---

## 📝 Notes

- Database is pre-seeded with 6 courses and 6 sample events
- All passwords are hashed with bcrypt (10 rounds)
- Service Worker caches assets for offline use
- Push notifications require HTTPS (works on *.workers.dev)
- Timezone set to Argentina (UTC-3)

Enjoy ColegioSync! 🎒📚
