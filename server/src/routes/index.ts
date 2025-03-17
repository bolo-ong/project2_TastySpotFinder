import express from "express";
import authRouter from "./authRoutes";
import reportRouter from "./reportRoutes";
import restaurantRouter from "./restaurantRoutes";
import reviewRouter from "./reviewRoutes";
import userRouter from "./userRoutes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/report", reportRouter);
router.use("/restaurant", restaurantRouter);
router.use("/review", reviewRouter);
router.use("/user", userRouter);

export default router;
