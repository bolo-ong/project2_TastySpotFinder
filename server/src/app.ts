import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import routes from "./routes";
import passport from "./passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import bodyParser from "body-parser";

const FileStoreWithSession = FileStore(session);

const app: Express = express();
const dbUrl: string | undefined = process.env.DB_URL;
const PORT: number = Number(process.env.PORT);

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    store: new FileStoreWithSession(),
    secret: process.env.COOKIE_SECRET ?? "",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 6, //6시간
      // secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = Promise;
mongoose.connect(`${dbUrl}`);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error: Error) => {
  console.error("MongoDB connection error:", error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api", routes);

// app.use(express.static(path.join(__dirname, "build")));

// app.get("/", function (req: Request, res: Response) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// app.use(function (req: Request, res: Response, next: NextFunction) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
