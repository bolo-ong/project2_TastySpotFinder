import { Request, Response, NextFunction } from "express";

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      console.error("User data not available after authentication");
      return res.redirect(`${CLIENT_URL}`);
    }

    // 세션 저장 완료를 기다림
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log("Authentication successful:", {
      sessionID: req.sessionID,
      user: req.user,
    });

    res.redirect(CLIENT_URL);
  } catch (error) {
    console.error("Authentication error:", error);
    res.redirect(`${CLIENT_URL}`);
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
        _id: req.user._id,
        displayName: req.user.displayName,
        profile_image: req.user.profile_image,
        provider: req.user.provider,
        savedRestaurantLists: req.user.savedRestaurantLists,
        savedRestaurants: req.user.savedRestaurants,
        reviewCount: req.user.reviewCount,
        receivedLikes: req.user.receivedLikes,
        role: req.user.role,
        ban: req.user.ban,
        recommendedRestaurantListsCount:
          req.user.recommendedRestaurantListsCount,
        recommendedRestaurantsCount: req.user.recommendedRestaurantsCount,
      };
      return res.status(200).send(userProfile);
    } else {
      return res.status(200).send("Login required");
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
