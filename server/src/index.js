"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// import routes from './routes';
const app = (0, express_1.default)();
const dbUrl = process.env.DB_URL;
const PORT = Number(process.env.PORT);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(`${dbUrl}`);
mongoose_1.default.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose_1.default.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});
// Express 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// app.use('/api', routes);
app.use(express_1.default.static(path_1.default.join(__dirname, "build")));
app.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
app.use(function (req, res, next) {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
