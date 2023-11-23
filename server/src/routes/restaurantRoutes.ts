import express from "express";
import {
  postRestaurantList,
  getRestaurantList,
  getRestaurant,
  crawlRestaurant,
} from "../controllers/restaurantController";
import { isAuthenticated } from "../middlewares/auth";

const restaurantRouter = express.Router();

restaurantRouter.post("/", isAuthenticated, postRestaurantList);
restaurantRouter.post("/crawl", crawlRestaurant);
restaurantRouter.get("/getRestaurantList", getRestaurantList);
restaurantRouter.get("/getRestaurant", getRestaurant);

export default restaurantRouter;
