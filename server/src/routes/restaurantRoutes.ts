import express from "express";
import {
  getRestaurant,
  getInfinityScrollRestaurants,
  getInfinityScrollSavedRestaurants,
  getInfinityScrollMyRecommended,
  postRestaurantList,
  crawlRestaurant,
  getNearbyRestaurants,
  deleteRestaurantList,
  patchRestaurantList,
} from "../controllers/restaurantController";
import {
  isAuthenticated,
  checkUserBanMiddleware,
} from "../middlewares/authMiddleware";

const restaurantRouter = express.Router();

restaurantRouter.get("/getRestaurant", getRestaurant);

restaurantRouter.get(
  "/getInfinityScrollRestaurants",
  getInfinityScrollRestaurants
);

restaurantRouter.get(
  "/getInfinityScrollSavedRestaurants",
  getInfinityScrollSavedRestaurants
);

restaurantRouter.get(
  "/getInfinityScrollMyRecommended",
  getInfinityScrollMyRecommended
);

restaurantRouter.get("/getNearbyRestaurants", getNearbyRestaurants);

restaurantRouter.post(
  "/",
  isAuthenticated,
  checkUserBanMiddleware,
  postRestaurantList
);
restaurantRouter.post("/crawl", crawlRestaurant);

restaurantRouter.delete(
  "/deleteRestaurantList",
  isAuthenticated,
  deleteRestaurantList
);

restaurantRouter.patch(
  "/patchRestaurantList",
  isAuthenticated,
  patchRestaurantList
);

export default restaurantRouter;
