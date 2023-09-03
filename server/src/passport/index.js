"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const kakaoStrategy_1 = require("./kakaoStrategy");
const User_1 = require("../models/User");
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    User_1.User.findOne({ userId: id }, (err, user) => {
        done(err, user);
    });
});
passport_1.default.use("kakao", kakaoStrategy_1.kakaoStrategy);
exports.default = passport_1.default;
