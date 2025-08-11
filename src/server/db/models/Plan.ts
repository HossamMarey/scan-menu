import mongoose, { Schema, Model } from 'mongoose';
import { IPlan } from '../types';

/**
 * Plan schema for subscription plans and pricing
 * Defines available subscription tiers with features and limits
 */
const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: /^[a-z0-9-]+$/, // Only lowercase letters, numbers, and hyphens
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price in cents
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD',
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    limits: {
      restaurants: {
        type: Number,
        required: true,
        min: 1,
      },
      menus: {
        type: Number,
        required: true,
        min: 1,
      },
      links: {
        type: Number,
        required: true,
        min: 1,
      },
      visits: {
        type: Number,
        required: true,
        min: 100, // Monthly visit limit
      },
      storage: {
        type: Number,
        required: true,
        min: 10, // Storage in MB
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'plans',
  }
);

// Indexes for performance
planSchema.index({ slug: 1 });
planSchema.index({ isActive: 1, price: 1 });
planSchema.index({ createdAt: -1 });

// Create and export the model
const Plan: Model<IPlan> =
  mongoose.models.Plan || mongoose.model<IPlan>('Plan', planSchema);

export default Plan;
