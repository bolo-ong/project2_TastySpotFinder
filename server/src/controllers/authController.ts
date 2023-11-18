import { Request, Response } from "express";

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const authenticateUser = (req: Request, res: Response) => {
  try {
    res.redirect(CLIENT_URL + "/redirect");
  } catch (err) {
    res.status(500);
  }
};

export const logOutUser = (req: Request, res: Response) => {
  try {
    req.logOut((err: Error) => {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      req.session.save(() => {
        res.send("Log out successful.");
      });
    });
  } catch (err) {
    res.status(500);
  }
};

export const logOutKakao = (req: Request, res: Response) => {
  try {
    req.logOut((err: Error) => {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      req.session.save(() => {
        res.redirect(CLIENT_URL);
      });
    });
  } catch (err) {
    res.status(500);
  }
};

export const getUserProfile = (req: Request, res: Response) => {
  try {
    if (req.isAuthenticated()) {
      const userProfile = {
        displayName: req.user.displayName,
        profile_image: req.user.profile_image,
        provider: req.user.provider,
      };
      res.send(userProfile);
    } else {
      res.send("Login required");
    }
  } catch (err) {
    res.status(500);
  }
};
