import mongoose, { Schema, Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { IMenuLink } from '../types';

/**
 * MenuLink schema for shareable menu links with tracking
 * Generates unique short links with customizable QR codes and UTM tracking
 */
const menuLinkSchema = new Schema<IMenuLink>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => nanoid(8), // Generate 8-character unique ID
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    styleConfig: {
      qrCodeColor: {
        type: String,
        trim: true,
        match: /^#[0-9A-Fa-f]{6}$/, // Hex color validation
        default: '#000000',
      },
      qrCodeLogo: {
        type: String,
        trim: true,
      },
      frameStyle: {
        type: String,
        enum: ['none', 'rounded', 'square'],
        default: 'rounded',
      },
      backgroundColor: {
        type: String,
        trim: true,
        match: /^#[0-9A-Fa-f]{6}$/, // Hex color validation
        default: '#ffffff',
      },
    },
    trackingMeta: {
      source: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      medium: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      campaign: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      table: {
        type: String,
        trim: true,
        maxlength: 20,
      },
      location: {
        type: String,
        trim: true,
        maxlength: 100,
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
    collection: 'menulinks',
  }
);

// Compound indexes for performance
menuLinkSchema.index({ menuId: 1, isActive: 1 });
menuLinkSchema.index({ slug: 1 });
menuLinkSchema.index({ createdAt: -1 });

// Virtual for link's visits
menuLinkSchema.virtual('visits', {
  ref: 'Visit',
  localField: '_id',
  foreignField: 'linkId',
});

// Ensure virtual fields are serialized
menuLinkSchema.set('toJSON', { virtuals: true });
menuLinkSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
menuLinkSchema.pre('save', async function (next) {
  if (this.isModified('slug') || this.isNew) {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const existingLink = await mongoose.models.MenuLink.findOne({
        slug: this.slug,
        _id: { $ne: this._id },
      });

      if (!existingLink) {
        break;
      }

      // Generate new slug if collision detected
      this.slug = nanoid(8);
      attempts++;
    }

    if (attempts === maxAttempts) {
      throw new Error('Failed to generate unique slug after multiple attempts');
    }
  }
  next();
});

// Create and export the model
const MenuLink: Model<IMenuLink> =
  mongoose.models.MenuLink ||
  mongoose.model<IMenuLink>('MenuLink', menuLinkSchema);

export default MenuLink;
