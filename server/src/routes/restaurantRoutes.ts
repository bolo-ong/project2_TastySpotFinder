import express from "express";
import {
  postRestaurantList,
  getRestaurant,
  crawlRestaurant,
} from "../controllers/restaurantController";
import { isAuthenticated } from "../middlewares/auth";

const restaurantRouter = express.Router();

restaurantRouter.post("/", isAuthenticated, postRestaurantList);
restaurantRouter.post("/crawl", crawlRestaurant);
restaurantRouter.get("/", getRestaurant);

export default restaurantRouter;
