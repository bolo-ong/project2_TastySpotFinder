import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLikeReview } from "apis/reviewAPI";
import {
  restaurantReviewKeys,
  restaurantListReviewKeys,
} from "constants/queryKeys";
import { useToast } from "hooks/useToast";
import { ReviewData } from "types";
import axios from "axios";

export const usePatchLikeReviewMutation = (
  restaurantId: string,
  userId: string,
  sortType: "최신순" | "등록순",
  type: "restaurant" | "restaurantList"
) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation((reviewId: string) => patchLikeReview(reviewId), {
    onMutate: async (reviewId: string) => {
      const queryKey =
        type === "restaurant"
          ? restaurantReviewKeys.list(restaurantId, userId, sortType)
          : restaurantListReviewKeys.list(restaurantId, userId, sortType);

      await queryClient.cancelQueries(queryKey);

      const previousReviews = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: any) =>
          page.map((review: ReviewData) =>
            review._id === reviewId
              ? {
                  ...review,
                  likeCount: review.like.includes(userId)
                    ? review.likeCount - 1
                    : review.likeCount + 1,
                  like: review.like.includes(userId)
                    ? review.like.filter((id: string) => id !== userId)
                    : [...review.like, userId],
                }
              : review
          )
        ),
      }));

      return { previousReviews, queryKey };
    },

    onError: (error, reviewId, context: any) => {
      queryClient.setQueryData(context.queryKey, context.previousReviews);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        showToast(errorMessage, "warning");
      }
    },

    onSettled: () => {
      const queryKey =
        type === "restaurant"
          ? restaurantReviewKeys.list(restaurantId, userId, sortType)
          : restaurantListReviewKeys.list(restaurantId, userId, sortType);

      queryClient.invalidateQueries(queryKey);
    },
  });
};
