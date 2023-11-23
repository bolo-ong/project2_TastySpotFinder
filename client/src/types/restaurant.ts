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

export interface Restaurant {
  _id?: string;
  name: string;
  category: string;
  location: string;
  contact: string;
  menu: string[];
  img: string[];
  count?: number;
  like?: number;
  savedByUsers?: string[];
  comments?: Comment[];
}
