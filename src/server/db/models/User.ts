import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

/**
 * User schema for authentication and profile management
 * Handles Google OAuth users with role-based access
 */
const userSchema = new Schema<IUser>(
  {
    authProviderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for performance
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ authProviderId: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's restaurants
userSchema.virtual('restaurants', {
  ref: 'Restaurant',
  localField: '_id',
  foreignField: 'ownerId',
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Create and export the model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
