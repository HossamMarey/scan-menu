import mongoose, { Schema, Model } from 'mongoose';
import { ISubscription } from '../types';

/**
 * Subscription schema for user subscription management
 * Handles Stripe integration and subscription lifecycle
 */
const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      required: true,
      index: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
      index: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
      index: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    stripeSubscriptionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
      index: true,
    },
    stripeCustomerId: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'subscriptions',
  }
);

// Compound indexes for performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ planId: 1, status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ createdAt: -1 });

// Ensure only one active subscription per user
subscriptionSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
  }
);

// Create and export the model
const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
