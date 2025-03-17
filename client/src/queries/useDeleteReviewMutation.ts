import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "apis/reviewAPI";
import {
  restaurantReviewKeys,
  restaurantListReviewKeys,
} from "constants/queryKeys";
import { ReviewData } from "types";
import { useToast } from "hooks/useToast";
import axios from "axios";

export const useDeleteReviewMutation = (
  restaurantId: string,
  userId: string,
  sortType: "최신순" | "등록순",
  type: "restaurant" | "restaurantList"
) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation((reviewId: string) => deleteReview(reviewId), {
    onMutate: async (reviewId: string) => {
      const queryKey =
        type === "restaurant"
          ? restaurantReviewKeys.list(restaurantId, userId, sortType)
          : restaurantListReviewKeys.list(restaurantId, userId, sortType);

      await queryClient.cancelQueries(queryKey);

      const previousReviews =
        queryClient.getQueryData<ReviewData[][]>(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: ReviewData[]) =>
          page.filter((review: ReviewData) => review._id !== reviewId)
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
