import passport, { session } from "passport";
import express from "express";

const authRouter = express.Router();

const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

authRouter.get("/kakao", passport.authenticate("kakao"));
authRouter.get(
  "/oauth/kakao",
  passport.authenticate("kakao", {
    failureRedirect: CLIENT_URL,
  }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  }
);
const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.KAKAO_LOGOUT_REDIRECT_URI}`;
authRouter.get("/logout/kakao", (req, res, next) => {
  res.redirect(KAKAO_LOGOUT_URL);
});
authRouter.get("/logout/kakao/callback", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log("logout", err);
    }
    req.session.save(() => {
      res.redirect(CLIENT_URL);
    });
  });
});

authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/oauth/google",
  passport.authenticate("google", {
    failureRedirect: CLIENT_URL,
  }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  }
);
authRouter.get("/logout/google", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log("logout", err);
    }
    req.session.save(() => {
      res.redirect(CLIENT_URL);
    });
  });
});

authRouter.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  }
});

export default authRouter;
