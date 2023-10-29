import { Request, Response } from "express";

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const authenticateUser = (req: Request, res: Response) => {
  res.redirect(CLIENT_URL);
};

export const logOutUser = (req: Request, res: Response) => {
  req.logOut((err: Error) => {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    req.session.save(() => {
      res.send("Log out successful.");
    });
  });
};

export const logOutKakao = async (req: Request, res: Response) => {
  req.logOut((err: Error) => {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    req.session.save(() => {
      res.redirect(CLIENT_URL);
    });
  });
};

export const getUser = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send("Login information not found.");
  }
};
