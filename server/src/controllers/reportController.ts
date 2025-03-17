import { Request, Response } from "express";
import mongoose from "mongoose";
import { Review, ReviewType } from "../models/Review";
import { RestaurantList, RestaurantListType } from "../models/RestaurantList";
import { User, UserType } from "../models/User";

export const patchReportContent = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user?._id);
  const { contentType, contentId } = req.body;

  try {
    let content;
    let contentAuthor;

    switch (contentType) {
      case "review":
        content = await Review.findById(contentId);
        if (content) contentAuthor = await User.findById(content.writer);
        break;
      case "restaurantList":
        content = await RestaurantList.findById(contentId);
        if (content) contentAuthor = await User.findById(content.writer);
        break;
      case "user":
        content = await User.findById(contentId);
        break;
      default:
        return res.status(400).json({ message: "신고할 수 없는 유형 입니다." });
    }

    if (!content) {
      return res.status(404).json({ message: "콘텐츠를 찾을 수 없습니다." });
    }

    // 사용자가 이미 신고했는지 확인
    const alreadyReported = content.reportedBy?.some(
      (report) => report.userId && report.userId.equals(userId)
    );
    if (alreadyReported) {
      return res.status(200).json({ message: "이미 신고하신 콘텐츠입니다." });
    }

    // 콘텐츠의 신고한 사용자 목록 업데이트
    const reportEntry = { userId, reportedAt: new Date() };
    content.reportedBy = content.reportedBy || [];
    content.reportedBy.push(reportEntry);

    // 콘텐츠 작성자의 신고한 사용자 목록 업데이트
    if (contentAuthor) {
      contentAuthor.reportedBy = contentAuthor.reportedBy || [];
      contentAuthor.reportedBy.push(reportEntry);

      await handleUserBan(contentAuthor);
      await contentAuthor.save();
    }

    // 콘텐츠가 5회 이상 신고되면 블라인드 처리 (리뷰와 레스토랑 리스트만 해당)
    if (isReviewOrRestaurantList(content) && content.reportedBy.length >= 5) {
      content.isBlinded = true;
    }

    await content.save();
    res.status(200).json({ message: "신고가 접수되었습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 타입 가드
function isReviewOrRestaurantList(
  content: any
): content is ReviewType | RestaurantListType {
  return content && "reportedBy" in content && "isBlinded" in content;
}

async function handleUserBan(user: UserType) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 정지 중인 사용자는 신고 기록을 업데이트하지 않음
  if (user.ban && user.ban.banLiftAt && user.ban.banLiftAt > now) {
    return;
  }

  const recentReports = user.reportedBy?.filter(
    (report) => report.reportedAt > thirtyDaysAgo
  );

  // 유저가 최근 30일 동안 10회 이상 신고되면 1일 동안 정지
  if (recentReports?.length || 0 >= 10) {
    user.ban = {
      reason: "최근 30일 동안 10회 이상 신고 누적",
      bannedAt: now,
      banLiftAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1일 후
    };
  } else if (user.ban && user.ban.banLiftAt && user.ban.banLiftAt <= now) {
    // 정지가 풀릴 때 신고한 유저 목록과 정지 관련 정보 초기화
    user.reportedBy = [];
    user.ban = {
      reason: undefined,
      bannedAt: undefined,
      banLiftAt: undefined,
    };
  }
}
