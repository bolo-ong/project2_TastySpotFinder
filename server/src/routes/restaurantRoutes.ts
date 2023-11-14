import express from "express";
import {
  postRestaurantList,
  getRestaurant,
  crawlRestaurant,
} from "../controllers/restaurantController";

const restaurantRouter = express.Router();

restaurantRouter.post("/", postRestaurantList);
restaurantRouter.post("/crawl", crawlRestaurant);
restaurantRouter.get("/", getRestaurant);

export default restaurantRouter;
