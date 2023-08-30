import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
// import routes from './routes';

const app: Express = express();
const dbUrl: string | undefined = process.env.DB_URL;
const PORT: number = Number(process.env.PORT);

app.use(cors());
app.use(express.json());

mongoose.Promise = Promise;
mongoose.connect(`${dbUrl}`);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error: Error) => {
  console.error("MongoDB connection error:", error);
});

// Express 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.use('/api', routes);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
