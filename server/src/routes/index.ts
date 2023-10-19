import express from "express";
import authRouter from "./authRoutes";
import restaurantRouter from "./restaurantRoutes";

const router = express.Router();

// const routineRouter = require("./routineRoutes");
// const userRouter = require("./userRoutes");

// router.use("/routine", routineRouter);
// router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/restaurant", restaurantRouter);

export default router;
