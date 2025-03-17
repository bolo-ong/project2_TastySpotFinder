import { User } from "types/user";
import { Restaurant, RestaurantList } from "types/restaurant";

export interface ReviewData {
  _id: string;
  restaurant?: Restaurant;
  restaurantList?: RestaurantList;
  content?: string;
  like: string[];
  likeCount: number;
  reportedBy?: [];
  isBlinded: boolean;
  writer: User;
  createdAt: string;
  updatedAt: string;
  isLoading?: boolean;
  type?: "restaurant" | "restaurantList";
}
