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

authRouter.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("logout");
    res.redirect("http://localhost:3000");
  });
});

export default authRouter;
