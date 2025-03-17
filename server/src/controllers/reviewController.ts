import mongoose, { PipelineStage } from "mongoose";
import { Request, Response } from "express";
import { Review, ReviewType, User } from "../models";
import { shouldBlindComment } from "../utils";

export const patchReview = async (req: Request, res: Response) => {
  try {
    const { reviewId, content } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    if (!existingReview.writer.equals(userId)) {
      return res
        .status(403)
        .json({ message: "리뷰를 수정할 권한이 없습니다." });
    }

    // 댓글의 유해도를 확인하고, 블라인드 처리 결정
    const isBlinded = await shouldBlindComment(content);

    existingReview.content = content;
    existingReview.isBlinded = isBlinded;
    await existingReview.save();

    res.status(200).json({ message: "리뷰가 수정되었습니다." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "리뷰를 수정하는 중 오류가 발생했습니다." });
  }
};

export const postReview = async (req: Request, res: Response) => {
  try {
    const { content, _id, type } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    // 댓글의 유해도를 확인하고, 블라인드 처리 결정
    const isBlinded = await shouldBlindComment(content);

    let newReview: Partial<ReviewType> = {
      writer: userId,
      content: content,
      isBlinded: isBlinded,
    };

    // type을 소문자로 변환하여 비교
    const normalizedType = type.toLowerCase();
    if (normalizedType === "restaurant") {
      newReview.restaurant = _id;
    } else if (normalizedType === "restaurantlist") {
      newReview.restaurantList = _id;
    } else {
      return res.status(400).json({ message: "유효하지 않은 타입입니다." });
    }

    const createdReview = await Review.create(newReview);
    res.status(200).json(createdReview);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

export const getInfinityScrollRestaurantReview = async (
  req: Request,
  res: Response
) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 8;
  const skipCount = 8 * (page - 1);
  const type = req.query.type;
  const restaurantId = new mongoose.Types.ObjectId(req.query.id as string);
  const sortType = req.query.sortType;
  const userId = req.query.userId as string | undefined;

  try {
    let sortAggregate: PipelineStage[] = [
      {
        $match:
          type === "restaurant"
            ? { restaurant: restaurantId }
            : { restaurantList: restaurantId },
      },
      { $addFields: { likeCount: { $size: "$like" } } },
    ];

    if (sortType === "최신순") {
      sortAggregate.push({ $sort: { createdAt: -1, _id: -1 } });
    } else if (sortType === "등록순") {
      sortAggregate.push({ $sort: { createdAt: +1, _id: -1 } });
    }

    let reviews = await Review.aggregate(sortAggregate).exec();

    // 로그인 유저의 게시물을 최상단에 올립니다
    if (userId && sortType === "등록순") {
      const userComments = reviews.filter(
        (review) => review.writer.toString() === userId
      );
      const otherComments = reviews.filter(
        (review) => review.writer.toString() !== userId
      );
      reviews = [...userComments, ...otherComments];
    }

    const paginatedReviews = reviews.slice(skipCount, pageSize);

    const populatedReviews = await Review.populate(paginatedReviews, {
      path: "writer",
    });

    res.status(200).json(populatedReviews);
  } catch (error) {
    res.status(500);
  }
};

export const patchLikeReview = async (req: Request, res: Response) => {
  const reviewId = req.body.reviewId;
  const userId = new mongoose.Types.ObjectId(req.user?._id);

  try {
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    if (!existingReview.like) {
      existingReview.like = [];
    }

    const alreadyLiked = existingReview.like.includes(userId);

    // 리뷰 작성자의 receivedLikes 업데이트
    const increment = alreadyLiked ? -1 : 1; // 좋아요 취소면 -1, 좋아요면 +1
    await User.findByIdAndUpdate(existingReview.writer, {
      $inc: { receivedLikes: increment },
    });

    if (alreadyLiked) {
      existingReview.like = existingReview.like.filter(
        (id) => !id.equals(userId)
      );
    } else {
      existingReview.like.push(userId);
    }

    await existingReview.save();
    res.status(200).json(existingReview);
  } catch (err) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const reviewId = req.body.reviewId;
  const userId = new mongoose.Types.ObjectId(req.user?._id);
  const userRole = req.user?.role;

  try {
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "해당 리뷰를 찾을 수 없습니다." });
    }

    const isOwner = existingReview.writer.equals(userId);
    const canDeleteUser = userRole === "admin" || userRole === "moderator";

    if (!isOwner && !canDeleteUser) {
      return res.status(403).json({ message: "삭제할 권한이 없습니다." });
    }

    await existingReview.deleteOne();
    res.status(200).json({ message: "성공적으로 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getMyReviews = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user?._id);
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const reviews = await Review.find({ writer: userId })
      .populate([
        {
          path: "restaurant",
          select: "name",
        },
        {
          path: "restaurantList",
          select: "title description",
        },
      ])
      .select("content createdAt like restaurant restaurantList")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalCount = await Review.countDocuments({ writer: userId });

    const reviewsWithType = reviews.map((review) => {
      const type = review.restaurant ? "restaurant" : "restaurantList";

      return {
        ...review,
        type,
        likeCount: review.like?.length || 0,
      };
    });

    res.status(200).json({
      reviews: reviewsWithType,
      totalPages: Math.ceil(totalCount / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
