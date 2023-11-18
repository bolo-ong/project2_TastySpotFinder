import { Request, Response, NextFunction } from "express";

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.status(401).json({ message: "로그인 후 이용해 주세요." });
    }
  } catch (err) {
    res.status(500);
  }
};
