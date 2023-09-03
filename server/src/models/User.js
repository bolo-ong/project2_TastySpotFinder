"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// models/User.ts 파일
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: String,
    userName: String,
    provider: String,
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.User = User;
