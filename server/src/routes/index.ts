import express from "express";
import authRouter from "./authRoutes";

const router = express.Router();

// const routineRouter = require("./routineRoutes");
// const userRouter = require("./userRoutes");

// router.use("/routine", routineRouter);
// router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
