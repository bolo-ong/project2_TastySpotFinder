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
const routes_1 = __importDefault(require("./routes"));
const passport_1 = __importDefault(require("./passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const dbUrl = process.env.DB_URL;
const PORT = Number(process.env.PORT);
const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_SECRET || "",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
    },
}));
app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    next();
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
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
app.use("/api", routes_1.default);
// app.use(express.static(path.join(__dirname, "build")));
// app.get("/", function (req: Request, res: Response) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
// app.use(function (req: Request, res: Response, next: NextFunction) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
