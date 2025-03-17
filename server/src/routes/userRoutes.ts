import express from "express";
import {
  patchLikeRestaurant,
  patchLikeRestaurantList,
  deleteUserProfile,
} from "../controllers/userController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const userRouter = express.Router();

userRouter.patch("/patchLikeRestaurant", isAuthenticated, patchLikeRestaurant);
userRouter.patch(
  "/patchLikeRestaurantList",
  isAuthenticated,
  patchLikeRestaurantList
);
userRouter.delete("/profile", isAuthenticated, deleteUserProfile);

export default userRouter;
