import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "apis/reviewAPI";
import { useToast } from "hooks/useToast";
import { ReviewData } from "types";
import axios from "axios";

export const useDeleteMyReviewMutation = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),

    onMutate: async (reviewId: string) => {
      const queryKey = ["myReviews"];
      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData(queryKey);

      // 낙관적 업데이트: 해당 reviewId를 가진 리뷰를 제거
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          reviews: page.reviews.filter(
            (review: ReviewData) => review._id !== reviewId
          ),
        })),
      }));

      return { previousData };
    },

    onError: (error, _, context) => {
      // 에러 시 롤백
      if (context?.previousData) {
        queryClient.setQueryData(["myReviews"], context.previousData);
      }

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        showToast(errorMessage, "warning");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["myReviews"]);
    },
  });
};
