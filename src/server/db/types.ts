import { Document, Types } from 'mongoose';

/**
 * Database types and interfaces for ScanMenu application
 * Provides type safety for all MongoDB collections
 */

// Base interface for all documents
export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Internationalization support for text fields
export interface I18nText {
  en: string;
  ar: string;
}

// User authentication and profile
export interface IUser extends BaseDocument {
  authProviderId: string; // Google OAuth ID
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

// Restaurant branding configuration
export interface RestaurantBranding {
  logo?: string; // S3 key for logo image
  primaryColor?: string; // Hex color code
  secondaryColor?: string; // Hex color code
  bannerImage?: string; // S3 key for banner image
}

// Social media links
export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
}

// Restaurant information
export interface IRestaurant extends BaseDocument {
  ownerId: Types.ObjectId; // Reference to User
  name: I18nText; // Restaurant name in multiple languages
  slug: string; // Unique URL slug
  description?: I18nText; // Restaurant description
  branding: RestaurantBranding;
  socials: SocialLinks;
  isActive: boolean;
}

// Menu document
export interface IMenu extends BaseDocument {
  restaurantId: Types.ObjectId; // Reference to Restaurant
  name: string;
  description?: string;
  pdfKey: string; // S3 key for PDF file
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
}

// Menu link style configuration
export interface LinkStyleConfig {
  qrCodeColor?: string; // Hex color for QR code
  qrCodeLogo?: string; // S3 key for QR code logo
  frameStyle?: 'none' | 'rounded' | 'square';
  backgroundColor?: string; // Background color for viewer
}

// UTM and tracking metadata
export interface TrackingMeta {
  source?: string; // facebook, instagram, table, etc.
  medium?: string; // social, qr, direct
  campaign?: string; // Custom campaign name
  table?: string; // Table number for restaurant
  location?: string; // Physical location identifier
}

// Menu link for sharing and tracking
export interface IMenuLink extends BaseDocument {
  menuId: Types.ObjectId; // Reference to Menu
  slug: string; // Short nanoid slug
  name?: string; // Optional name for the link
  styleConfig: LinkStyleConfig;
  trackingMeta: TrackingMeta;
  isActive: boolean;
}

// Visit tracking for analytics
export interface IVisit extends BaseDocument {
  linkId: Types.ObjectId; // Reference to MenuLink
  timestamp: Date;
  ipHash: string; // Hashed IP for privacy
  userAgent?: string; // Browser/device info
  source?: string; // From tracking meta
  table?: string; // Table number if applicable
  country?: string; // Detected country
  city?: string; // Detected city
  referrer?: string; // HTTP referrer
}

// Subscription plans
export interface IPlan extends BaseDocument {
  name: string;
  slug: string; // 'free', 'pro', 'enterprise'
  price: number; // Monthly price in cents
  currency: string; // 'USD', 'EUR', etc.
  features: string[]; // List of feature identifiers
  limits: {
    restaurants: number;
    menus: number;
    links: number;
    visits: number; // Monthly visit limit
    storage: number; // Storage in MB
  };
  isActive: boolean;
}

// User subscriptions
export interface ISubscription extends BaseDocument {
  userId: Types.ObjectId; // Reference to User
  planId: Types.ObjectId; // Reference to Plan
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string; // Stripe subscription ID
  stripeCustomerId?: string; // Stripe customer ID
}
