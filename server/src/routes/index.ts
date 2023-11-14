import express from "express";
import authRouter from "./authRoutes";
import restaurantRouter from "./restaurantRoutes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/restaurant", restaurantRouter);

export default router;
