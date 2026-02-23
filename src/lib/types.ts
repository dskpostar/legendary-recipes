// ===== Database Types =====

export interface Chef {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  restaurant: string;
  country: string;
  bio: string;
  is_verified: boolean;
  membership_plan: 'free' | 'pro' | 'elite';
  follower_count: number;
}

export interface Recipe {
  id: string;
  chef_id: string;
  title: string;
  description: string;
  hero_image_url: string;
  cuisine_type: CuisineType;
  season_tags: SeasonTag[];
  tier: RecipeTier;
  access_level: AccessLevel;
  prep_time_minutes: number;
  total_time_minutes: number;
  servings: number;
  likes_count: number;
  comments_count: number;
  is_published: boolean;
}

export interface RecipeComponent {
  id: string;
  recipe_id: string;
  name: string;
  image_url: string;
  video_url: string;
  instructions: string;
  sort_order: number;
}

export interface Ingredient {
  id: string;
  component_id: string;
  name: string;
  quantity: number;
  unit: string;
  sort_order: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  is_bocuse_official: boolean;
  sort_order: number;
}

export interface CollectionRecipe {
  id: string;
  collection_id: string;
  recipe_id: string;
  sort_order: number;
}

// ===== User & Social Types =====

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  membership_plan: 'free' | 'pro' | 'elite';
}

export interface UserLike {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
}

export interface ChefFollow {
  id: string;
  user_id: string;
  chef_id: string;
  created_at: string;
}

// ===== Enums & Constants =====

export type RecipeTier = 'base' | 'featured' | 'top' | 'bocuse_collection' | 'legendary';
export type AccessLevel = 'free' | 'pro' | 'elite' | 'bocuse';
export type CuisineType = 'french' | 'japanese' | 'italian' | 'spanish' | 'nordic' | 'american' | 'indian' | 'chinese' | 'other';
export type SeasonTag = 'spring' | 'summer' | 'autumn' | 'winter' | 'all_season';

export const CUISINE_LABELS: Record<CuisineType, string> = {
  french: 'French',
  japanese: 'Japanese',
  italian: 'Italian',
  spanish: 'Spanish',
  nordic: 'Nordic',
  american: 'American',
  indian: 'Indian',
  chinese: 'Chinese',
  other: 'Other',
};

export const TIER_LABELS: Record<RecipeTier, string> = {
  base: 'Base',
  featured: 'Featured',
  top: 'Top',
  bocuse_collection: "Bocuse d'Or",
  legendary: 'Legendary',
};

export const SEASON_LABELS: Record<SeasonTag, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
  all_season: 'All Season',
};

export const ACCESS_LABELS: Record<AccessLevel, string> = {
  free: 'Free',
  pro: 'Pro',
  elite: 'Elite',
  bocuse: "Bocuse d'Or",
};
