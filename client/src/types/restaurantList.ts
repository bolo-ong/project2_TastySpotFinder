export interface RestaurantList {
  _id?: string;
  title: string;
  thumbnail?: string[];
  description?: string;
  crawlURL: string;
  like: number;
  writer: string;
  restaurants?: string[];
  savedByUsers?: string[];
  comments?: Comment[];
}
