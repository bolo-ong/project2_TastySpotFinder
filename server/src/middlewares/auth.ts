import { Request, Response, NextFunction } from "express";

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Passport, OAuth2.0으로 소셜 로그인 한 경우, req.isAuthenticated()를 이용한 인증상태 확인
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).json({ message: "로그인 후 이용해 주세요." });
  }
};
