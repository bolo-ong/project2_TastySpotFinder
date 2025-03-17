import mongoose from "mongoose";
import { Request, Response } from "express";
import { User, Restaurant, RestaurantList, Review } from "../models";

export const patchLikeRestaurant = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const restaurantId = req.body.id as string;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const objectIdRestaurantId = new mongoose.Types.ObjectId(restaurantId);
    const alreadyLiked = user.savedRestaurants.includes(objectIdRestaurantId);

    const userUpdate = alreadyLiked
      ? { $pull: { savedRestaurants: objectIdRestaurantId } }
      : { $push: { savedRestaurants: objectIdRestaurantId } };

    await User.updateOne({ _id: userId }, userUpdate).session(session);

    const restaurantUpdate = alreadyLiked
      ? { $pull: { savedByUsers: userId }, $inc: { like: -1 } }
      : { $push: { savedByUsers: userId }, $inc: { like: 1 } };

    await Restaurant.updateOne(
      { _id: objectIdRestaurantId },
      restaurantUpdate
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.sendStatus(200);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500);
  }
};

export const patchLikeRestaurantList = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const restaurantListId = req.body.id as string;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const objectIdRestaurantListId = new mongoose.Types.ObjectId(
      restaurantListId
    );
    const alreadyLiked = user.savedRestaurantLists.includes(
      objectIdRestaurantListId
    );

    const userUpdate = alreadyLiked
      ? { $pull: { savedRestaurantLists: objectIdRestaurantListId } }
      : { $push: { savedRestaurantLists: objectIdRestaurantListId } };

    await User.updateOne({ _id: userId }, userUpdate).session(session);

    const restaurantListUpdate = alreadyLiked
      ? { $pull: { savedByUsers: userId }, $inc: { like: -1 } }
      : { $push: { savedByUsers: userId }, $inc: { like: 1 } };

    await RestaurantList.updateOne(
      { _id: objectIdRestaurantListId },
      restaurantListUpdate
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.sendStatus(200);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500);
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 사용자 찾기
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // 사용자가 작성한 리뷰 삭제
    await Review.deleteMany({ writer: userId }).session(session);

    // 사용자가 좋아요한 식당에서 사용자 ID 제거
    await Restaurant.updateMany(
      { savedByUsers: userId },
      {
        $pull: { savedByUsers: userId },
        $inc: { like: -1 },
      }
    ).session(session);

    // 사용자가 좋아요한 맛집 리스트에서 사용자 ID 제거
    await RestaurantList.updateMany(
      { savedByUsers: userId },
      {
        $pull: { savedByUsers: userId },
        $inc: { like: -1 },
      }
    ).session(session);

    // 사용자 삭제
    await User.deleteOne({ _id: userId }).session(session);

    // 트랜잭션 커밋
    await session.commitTransaction();
    session.endSession();

    // 성공 응답 보내기
    res.status(200).json({ message: "User profile deleted successfully" });

    // 세션 삭제 (응답 후 처리)
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete user profile error:", error);
    res.status(500).json({ message: "Failed to delete user profile" });
  }
};
