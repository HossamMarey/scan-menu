/**
 * Database models index file
 * Exports all Mongoose models for easy importing throughout the application
 */

// Import all models
import User from './User';
import Restaurant from './Restaurant';
import Menu from './Menu';
import MenuLink from './MenuLink';
import Visit from './Visit';
import Plan from './Plan';
import Subscription from './Subscription';

// Export all models
export { User, Restaurant, Menu, MenuLink, Visit, Plan, Subscription };

// Export types for convenience
export {
  type IUser,
  type IRestaurant,
  type IMenu,
  type IMenuLink,
  type IVisit,
  type IPlan,
  type ISubscription,
  type I18nText,
  type RestaurantBranding,
  type SocialLinks,
  type LinkStyleConfig,
  type TrackingMeta,
} from '../types';

// Default export for easier importing
const models = {
  User,
  Restaurant,
  Menu,
  MenuLink,
  Visit,
  Plan,
  Subscription,
};

export default models;
