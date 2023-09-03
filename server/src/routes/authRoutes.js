"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const CALLBACK_URL = process.env.CALLBACK_URL || "http://localhost:8080/oauth";
authRouter.get("/kakao", passport_1.default.authenticate("kakao"));
authRouter.get("/kakao/oauth", passport_1.default.authenticate("kakao", { failureRedirect: "/" }), (req, res) => {
    res.redirect("http://localhost:3000");
});
exports.default = authRouter;
