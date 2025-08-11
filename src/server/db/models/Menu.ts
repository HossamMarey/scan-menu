import mongoose, { Schema, Model } from 'mongoose';
import { IMenu } from '../types';

/**
 * Menu schema for PDF menu management
 * Handles menu documents with status tracking and S3 integration
 */
const menuSchema = new Schema<IMenu>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    pdfKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
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
    collection: 'menus',
  }
);

// Compound indexes for performance
menuSchema.index({ restaurantId: 1, status: 1 });
menuSchema.index({ restaurantId: 1, isActive: 1 });
menuSchema.index({ pdfKey: 1 });
menuSchema.index({ createdAt: -1 });

// Virtual for menu's links
menuSchema.virtual('links', {
  ref: 'MenuLink',
  localField: '_id',
  foreignField: 'menuId',
});

// Ensure virtual fields are serialized
menuSchema.set('toJSON', { virtuals: true });
menuSchema.set('toObject', { virtuals: true });

// Create and export the model
const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>('Menu', menuSchema);

export default Menu;
