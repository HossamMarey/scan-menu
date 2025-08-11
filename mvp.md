# SaaS MVP – Restaurant Menu Display & Analytics Platform

## Goal

Build a SaaS web app for restaurants to upload, share, and track their digital menus.  
The platform allows users to create QR codes and track analytics for each link,  
helping restaurants understand where and how customers are accessing their menus.

---

## Core Features

### Authentication & User Management

- Google OAuth login & signup.
- User profile management (name, email, business details, profile image).
- Restaurant information management (names in supported language, logo, brand colors, slug)

---

### Restaurant & Menu Creation

#### 1. Restaurant Registration

- Create a new restaurant profile with a **unique slug**  
  Example: `mydomain.com/restaurant-slug`

#### 2. Menu Management

- Create a new menu by entering:
  - Menu name
  - Description
  - Upload PDF (max size: **20MB**)
- Auto-generate a **short link** for the menu.
- Customize the **QR code** style (color, logo, frame style).
- Allow multiple links for the same menu with UTM-like query parameters for tracking:
  - Example:
    - `mydomain.com/restaurant-slug/dfwe?table=1`
    - `mydomain.com/restaurant-slug/dfwe?source=facebook`

#### 3. Menu Viewer

- Display menus in a **flipbook-style PDF viewer** (e.g., `react-pageflip`).
- Mobile-optimized and fast-loading.

---

### Restaurant Profile Page (Linktree-Style)

- **Public profile page** for each restaurant (e.g., `mydomain.com/restaurant-slug`).
- Display:
  - Restaurant name, logo, and banner image.
  - Short bio/description.
  - List of all menus with preview thumbnails.
  - Social media links (Instagram, Facebook, TikTok, WhatsApp, etc.).
  - Contact information (phone, email, location map).
  - Option to highlight featured menu or special offer at the top.
- Fully customizable branding (colors, fonts, background).
- Mobile-first design for QR code scanning.

---

### Link Tracking & Analytics

- Track clicks and unique visits for each menu link.
- Source-based analytics (`?source=facebook`, `?table=1`, etc.).
- Default: 30-day analytics with custom date range filtering for paid plans.
- Charts & graphs showing traffic trends.
- Export analytics to CSV/Excel.

---

### Dashboard Pages

1. **Home (Landing Page)**
   - Product overview, pricing plans, and login button (redirect to Google Auth).

2. **Dashboard**
   - Overview of total visits, top-performing menus, and recent activity.
   - Analytics for last 30 days (default) with custom date filtering for paid plans.

3. **Menus Page**
   - Table of existing menus with “Create New Menu” button.

4. **Single Menu Page**
   - Edit menu details.
   - Manage links & QR codes.
   - View analytics specific to this menu.

5. **Create Menu Page**
   - Form for uploading and configuring new menus.

6. **Menu Viewer Page**
   - Public-facing flipbook-style viewer.

7. **Settings Page**
   - Update user details, change password, set default language.

8. **Restaurant Profile Editor**
   - Page to edit restaurant profile details, social links, and branding.

---

### Tech Stack

- **Next.js (App Router) + TypeScript**
- **Shadcn UI** for components
- **next-intl** for multilingual support
- **MongoDB + Mongoose** for database
- **AWS S3** for file storage (PDFs & QR codes)
- RTL/LTR support
- Languages: **English (US)**, **Arabic (Egypt)**

---

### Payments & Plans

#### Payment Options

- PayPal
- Stripe
- Direct bank transfer via **InstaPay** (manual account activation)

#### Plans

**Free**

- 1 menu
- 1 link per menu
- 1 restaurant profile
- Analytics for last 30 days only (older data deleted)
- 5,000 visits/month limit

**Basic – $2/month (paid annually)**

- 2 menus
- 10 links per menu
- 1 restaurant profile
- 20,000 visits/month
- 60 days of analytics storage

**Pro – $14/month (paid annually)**

- 10 menus
- Unlimited links per menu
- 3 restaurant profiles
- 100,000 visits/month
- 2 years of analytics storage

**Enterprise – $35/month (paid annually)**

- Unlimited menus
- Unlimited links per menu
- Unlimited restaurant profiles
- Unlimited visits
- 2 years of analytics storage

---

### Extra Enhancements for MVP

- **QR Code Download Formats:** PNG, SVG, PDF
- **Custom Branding:** Add restaurant logo & brand colors to viewer & profile pages
- **Access Control:** Password-protected menus (optional)
- **Email Notifications:** Weekly performance summary for restaurant owners
- **API Access:** Integration for restaurant websites or apps
- **Offline Mode (PWA):** Menus can be cached for offline access

## Environment Variables

MONGODB_URI="...`"
S3_BUCKET_NAME='....'
S3_REGION='eu-north-1'
S3_ENDPOINT='.....s3.eu-north-1.amazonaws.com'
S3_ACCESS_KEY_ID='....'
S3_SECRET_ACCESS_KEY='....'
GOOGLE_CLIENT_ID='...'
GOOGLE_CLIENT_SECRET='...'
