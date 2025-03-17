import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReview } from "apis/reviewAPI";
import {
  restaurantReviewKeys,
  restaurantListReviewKeys,
} from "constants/queryKeys";
import { useToast } from "hooks/useToast";
import { ReviewData } from "types";

export const usePatchReviewMutation = (
  restaurantId: string,
  userId: string,
  sortType: "최신순" | "등록순",
  type: "restaurant" | "restaurantList"
) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation((data) => patchReview(data), {
    onMutate: async (data: any) => {
      const queryKey =
        type.toLowerCase() === "restaurant"
          ? restaurantReviewKeys.list(restaurantId, userId, sortType)
          : restaurantListReviewKeys.list(restaurantId, userId, sortType);

      await queryClient.cancelQueries(queryKey);

      const previousReviewData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: ReviewData[]) =>
          page.map((review: ReviewData) =>
            review._id === data.reviewId
              ? { ...review, content: data.content, isLoading: true }
              : review
          )
        ),
      }));

      return { previousReviewData, queryKey };
    },

    onError: (error, data, context: any) => {
      queryClient.setQueryData(context.queryKey, context.previousReviewData);
      showToast("리뷰 수정에 실패하였습니다.", "warning");
    },

    onSuccess: (data) => {
      const queryKey =
        type.toLowerCase() === "restaurant"
          ? restaurantReviewKeys.list(restaurantId, userId, sortType)
          : restaurantListReviewKeys.list(restaurantId, userId, sortType);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: ReviewData[]) =>
          page.map((review: ReviewData) =>
            review._id === data.reviewId
              ? { ...review, isLoading: false }
              : review
          )
        ),
      }));
    },

    onSettled: () => {
      const queryKey =
        type.toLowerCase() === "restaurant"
          ? restaurantReviewKeys.list(restaurantId, userId, sortType)
          : restaurantListReviewKeys.list(restaurantId, userId, sortType);

      queryClient.invalidateQueries(queryKey);
    },
  });
};
