import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

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

export const checkUserBanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "사용자 인증이 필요합니다." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    if (user.ban && user.ban.banLiftAt && new Date() < user.ban.banLiftAt) {
      return res.status(200).json({
        message: "현재 정지 상태입니다.",
        banLiftAt: user.ban.banLiftAt,
      });
    }
    next();
  } catch (error) {
    res.status(500);
  }
};
