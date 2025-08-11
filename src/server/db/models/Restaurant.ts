import mongoose, { Schema, Model } from 'mongoose';
import { IRestaurant } from '../types';

/**
 * Restaurant schema for restaurant management and branding
 * Supports internationalization and unique slug generation
 */
const restaurantSchema = new Schema<IRestaurant>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
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
    description: {
      en: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      ar: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    branding: {
      logo: {
        type: String,
        trim: true,
      },
      primaryColor: {
        type: String,
        trim: true,
        match: /^#[0-9A-Fa-f]{6}$/, // Hex color validation
      },
      secondaryColor: {
        type: String,
        trim: true,
        match: /^#[0-9A-Fa-f]{6}$/, // Hex color validation
      },
      bannerImage: {
        type: String,
        trim: true,
      },
    },
    socials: {
      website: {
        type: String,
        trim: true,
        match: /^https?:\/\/.+/, // Basic URL validation
      },
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      whatsapp: {
        type: String,
        trim: true,
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
    collection: 'restaurants',
  }
);

// Compound indexes for performance
restaurantSchema.index({ ownerId: 1, isActive: 1 });
restaurantSchema.index({ slug: 1 });
restaurantSchema.index({ createdAt: -1 });

// Virtual for restaurant's menus
restaurantSchema.virtual('menus', {
  ref: 'Menu',
  localField: '_id',
  foreignField: 'restaurantId',
});

// Ensure virtual fields are serialized
restaurantSchema.set('toJSON', { virtuals: true });
restaurantSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate slug uniqueness
restaurantSchema.pre('save', async function (next) {
  if (this.isModified('slug')) {
    const existingRestaurant = await mongoose.models.Restaurant.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingRestaurant) {
      throw new Error(`Restaurant slug "${this.slug}" is already taken`);
    }
  }
  next();
});

// Create and export the model
const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant ||
  mongoose.model<IRestaurant>('Restaurant', restaurantSchema);

export default Restaurant;
