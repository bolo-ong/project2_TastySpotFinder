import express from "express";
import {
  postReview,
  patchReview,
  getInfinityScrollRestaurantReview,
  patchLikeReview,
  deleteReview,
  getMyReviews,
} from "../controllers/reviewController";
import {
  isAuthenticated,
  checkUserBanMiddleware,
} from "../middlewares/authMiddleware";

const reviewRouter = express.Router();

reviewRouter.get(
  "/getInfinityScrollRestaurantReview",
  getInfinityScrollRestaurantReview
);

reviewRouter.get("/getMyReviews", isAuthenticated, getMyReviews);

reviewRouter.post(
  "/postReview",
  isAuthenticated,
  checkUserBanMiddleware,
  postReview
);

reviewRouter.patch("/patchReview", isAuthenticated, patchReview);
reviewRouter.patch("/patchLikeReview", isAuthenticated, patchLikeReview);

reviewRouter.delete("/deleteReview", isAuthenticated, deleteReview);

export default reviewRouter;
