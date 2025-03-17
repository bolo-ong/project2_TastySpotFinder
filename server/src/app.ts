import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import MongoStore from "connect-mongo";

// 환경 변수를 가장 먼저 로드
const NODE_ENV = process.env.NODE_ENV || "development";
const rootDir = path.resolve(__dirname, "..");

console.log("Current environment:", NODE_ENV);
console.log("Root directory:", rootDir);

// App Engine이 아닌 경우에만 .env 파일 로드
if (process.env.GAE_APPLICATION === undefined) {
  if (NODE_ENV === "development") {
    const envPath = path.resolve(rootDir, ".env.development");
    console.log("Loading development environment variables from:", envPath);
    dotenv.config({ path: envPath });
  } else if (NODE_ENV === "production") {
    const envPath = path.resolve(rootDir, ".env");
    console.log("Loading production environment variables from:", envPath);
    dotenv.config({ path: envPath });
  }
} else {
  console.log("Running on App Engine, using app.yaml environment variables");
}

// 환경 변수 확인을 위한 로그
console.log("Loaded environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  GAE_APPLICATION: process.env.GAE_APPLICATION ? "exists" : "missing",
  DB_URL: process.env.DB_URL ? "exists" : "missing",
  COOKIE_SECRET: process.env.COOKIE_SECRET ? "exists" : "missing",
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID ? "exists" : "missing",
  KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET ? "exists" : "missing",
  KAKAO_LOGIN_REDIRECT_URI: process.env.KAKAO_LOGIN_REDIRECT_URI
    ? "exists"
    : "missing",
});

// 나머지 import들은 환경 변수 로드 후에 진행
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes";
import passport from "./passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import bodyParser from "body-parser";
import { google } from "googleapis";

const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

let googleClient: any;

const initializeGoogleClient = async (): Promise<void> => {
  googleClient = await google.discoverAPI(DISCOVERY_URL);
};

initializeGoogleClient()
  .then(() => {
    console.log("Google API client initialized");
  })
  .catch((err) => {
    console.error("Error initializing Google API client:", err);
  });

export { googleClient };

// 환경 변수 검증
const validateEnv = () => {
  const required = ["DB_URL", "COOKIE_SECRET", "NODE_ENV"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

try {
  validateEnv();
} catch (error) {
  console.error("Environment validation failed:", error);
  process.exit(1);
}

const FileStoreWithSession = FileStore(session);

const app: Express = express();
const dbUrl: string | undefined = process.env.DB_URL;
const PORT: number = Number(process.env.PORT) || 8080;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://analog-period-447614-t4.du.r.appspot.com",
    "https://analog-period-447614-t4.du.r.appspot.com",
    "http://dangoal.kro.kr",
    "https://dangoal.kro.kr",
    "https://dangoal.o-r.kr",
    "https://www.dangoal.o-r.kr",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint 추가
app.get("/_ah/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/_ah/start", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/_ah/warmup", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use(cookieParser(process.env.COOKIE_SECRET));

// 개발 환경에서 sessions 디렉토리 생성
const createSessionDirectory = () => {
  const sessionDir = path.join(__dirname, "..", "sessions");
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }
};

if (process.env.NODE_ENV === "development") {
  createSessionDirectory();
}

// 세션 설정
const sessionConfig: session.SessionOptions = {
  secret: process.env.COOKIE_SECRET ?? "",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 6, // 6시간
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".o-r.kr" : undefined,
    path: "/",
  },
  store:
    process.env.NODE_ENV === "production"
      ? MongoStore.create({
          mongoUrl: dbUrl,
          ttl: 60 * 60 * 6, // 6시간
          autoRemove: "interval",
          autoRemoveInterval: 60, // 60분마다 만료된 세션 정리
          touchAfter: 24 * 3600, // 24시간 내에 세션 데이터가 변경되지 않으면 다시 저장하지 않음
          crypto: {
            secret: process.env.COOKIE_SECRET ?? "",
          },
        })
      : new FileStoreWithSession({
          path: path.join(__dirname, "..", "sessions"),
          retries: 3,
          reapAsync: false,
          ttl: 60 * 60 * 6,
          secret: process.env.COOKIE_SECRET,
          reapInterval: 60 * 60,
          logFn: function (message: string) {
            console.log("[Session Store]", message);
          },
          fileExtension: ".session",
          encoding: "utf8",
        }),
};

// App Engine의 여러 프록시 계층을 신뢰하도록 설정
if (process.env.NODE_ENV === "production") {
  app.enable("trust proxy");
  app.set("trust proxy", 2);
} else {
  app.set("trust proxy", 1);
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = Promise;

// MongoDB 연결 및 서버 시작을 async 함수로 래핑
const startServer = async () => {
  try {
    if (!dbUrl) {
      throw new Error("MongoDB URL is not defined in environment variables");
    }

    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Client URL: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

// API 라우트를 먼저 정의
app.use("/api", routes);

// 정적 파일 제공을 위한 미들웨어
const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));

// 마지막으로 클라이언트 라우트 처리
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// 에러 핸들링 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
