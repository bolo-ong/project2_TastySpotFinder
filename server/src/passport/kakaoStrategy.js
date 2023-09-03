"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kakaoStrategy = void 0;
const passport_kakao_1 = require("passport-kakao");
const User_1 = require("../models/User");
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL || "http://localhost:8080/oauth";
if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET || !CALLBACK_URL) {
    throw new Error("Kakao OAuth configuration missing");
}
exports.kakaoStrategy = new passport_kakao_1.Strategy({
    clientID: KAKAO_CLIENT_ID,
    clientSecret: KAKAO_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield User_1.User.findOne({ userId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        else {
            const newUser = new User_1.User({
                userId: profile.id,
                userName: profile.username,
                provider: "kakao",
                // kakao: profile._json,
            });
            yield newUser.save();
            return done(null, newUser);
        }
    }
    catch (error) {
        return done(error);
    }
}));
