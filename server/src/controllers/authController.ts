import { Request, Response } from "express";

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const authenticateUser = (req: Request, res: Response) => {
  res.redirect(CLIENT_URL);
};

export const logOutUser = (req: Request, res: Response) => {
  req.logOut((err: Error) => {
    if (err) {
      console.log("logOut", err);
    }
    req.session.save(() => {
      res.redirect(CLIENT_URL);
    });
  });
};
export const logOutKakao = (req: Request, res: Response) => {
  const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.KAKAO_LOGOUT_REDIRECT_URI}`;
  res.redirect(KAKAO_LOGOUT_URL);
};

export const getUser = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send("Login information not found.");
  }
};
