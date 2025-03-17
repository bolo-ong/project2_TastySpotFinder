export interface User {
  ban?: {
    reason?: string;
    bannedAt?: Date;
    banLiftAt?: Date;
  };
  displayName: string;
  profile_image: string;
  provider?: string;
  reviewCount?: number;
  receivedLikes?: number;
  role?: "admin" | "moderator" | "user";
  savedRestaurantLists?: [];
  savedRestaurants?: [];
  _id?: string;
  recommendedRestaurantListsCount?: number;
  recommendedRestaurantsCount?: number;
}
