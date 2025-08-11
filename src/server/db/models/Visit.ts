import mongoose, { Schema, Model } from 'mongoose';
import { IVisit } from '../types';

/**
 * Visit schema for analytics and tracking
 * Records user visits to menu links for analytics purposes
 */
const visitSchema = new Schema<IVisit>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuLink',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipHash: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    source: {
      type: String,
      trim: true,
      maxlength: 50,
      index: true,
    },
    table: {
      type: String,
      trim: true,
      maxlength: 20,
      index: true,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 2, // ISO country code
      uppercase: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    referrer: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'visits',
  }
);

// Compound indexes for analytics queries
visitSchema.index({ linkId: 1, timestamp: -1 });
visitSchema.index({ linkId: 1, source: 1 });
visitSchema.index({ linkId: 1, table: 1 });
visitSchema.index({ linkId: 1, country: 1 });
visitSchema.index({ timestamp: -1 });
visitSchema.index({ createdAt: -1 });

// TTL index to automatically delete old visits after 2 years
visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 }); // 2 years

// Create and export the model
const Visit: Model<IVisit> =
  mongoose.models.Visit || mongoose.model<IVisit>('Visit', visitSchema);

export default Visit;
