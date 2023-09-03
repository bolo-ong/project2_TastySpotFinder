"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const router = express_1.default.Router();
// const routineRouter = require("./routineRoutes");
// const userRouter = require("./userRoutes");
// router.use("/routine", routineRouter);
// router.use("/user", userRouter);
router.use("/auth", authRoutes_1.default);
exports.default = router;
