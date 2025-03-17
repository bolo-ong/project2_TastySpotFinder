import { User } from "./user";

export interface Restaurant {
  _id: string;
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
  locationCoordinates: {
    type: string;
    coordinates: [number, number];
  };
  distance?: string;
  naverPlaceId?: string;
}

export interface RestaurantList {
  _id: string;
  title: string;
  thumbnail: string[];
  description?: string;
  crawlURL: string;
  like: number;
  writer: User;
  restaurants?: Restaurant[];
  savedByUsers?: string[];
  comments?: Comment[];
  reportedBy?: [];
  isBlinded: boolean;
}
