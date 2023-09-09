import passport from "passport";
import express from "express";

const authRouter = express.Router();

const CALLBACK_URL: string =
  process.env.CALLBACK_URL || "http://localhost:8080/oauth";

authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get(
  "/kakao/oauth",
  passport.authenticate("kakao", { failureRedirect: "http://localhost:3000" }),
  (req, res) => {
    console.log("login");
    console.log(req.user);
    console.log(req.session);
    res.redirect("http://localhost:3000");
  }
);

const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=http://localhost:3000`;

authRouter.get("/logout", function (req, res, next) {
  // 현재 로그인된 사용자가 있을 경우 카카오 로그아웃 URL로 리디렉션
  if (req.isAuthenticated()) {
    res.redirect(KAKAO_LOGOUT_URL);
  } else {
    // 로그인되어 있지 않으면 로그아웃 처리
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      console.log("logout");
      console.log(req.user);
      console.log(req.session);
      res.redirect("http://localhost:3000");
    });
  }
});

export default authRouter;
