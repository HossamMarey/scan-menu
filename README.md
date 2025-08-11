# ScanMenu - Digital Menu SaaS Platform

A modern SaaS platform for restaurants to create, share, and track digital menus with QR codes.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes, MongoDB with Mongoose
- **Authentication:** NextAuth.js with Google OAuth
- **Internationalization:** next-intl (English/Arabic with RTL support)
- **Storage:** AWS S3 (planned)
- **Deployment:** Vercel/Netlify

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication (Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# AWS S3 (for file uploads - Phase 4)
S3_BUCKET_NAME=your_s3_bucket_name
S3_REGION=your_s3_region
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/[locale]/          # Next.js App Router with internationalization
├── components/            # Reusable UI components
├── server/               # Server-side utilities
│   ├── auth/            # Authentication configuration
│   └── db/              # Database models and utilities
├── types/               # TypeScript type definitions
└── messages/            # Internationalization messages
```

## Development Phases

- ✅ **Phase 0:** Repo hygiene & tooling
- ✅ **Phase 1:** App foundation with internationalization
- ✅ **Phase 2:** MongoDB data layer
- ✅ **Phase 3:** Authentication (Google OAuth)
- 🚧 **Phase 4:** AWS S3 storage
- 📋 **Phase 5:** Restaurant & menu management

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
