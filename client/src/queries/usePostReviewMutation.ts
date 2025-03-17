import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReview } from "apis/reviewAPI";
import {
  restaurantReviewKeys,
  restaurantListReviewKeys,
} from "constants/queryKeys";
import { useToast } from "hooks/useToast";
import { ReviewData } from "types";
import { convertUtcToKst } from "utils";

export const usePostReviewMutation = (
  restaurantId: string,
  userId: string,
  sortType: "최신순" | "등록순",
  type: "restaurant" | "restaurantList"
) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (data) => {
      const { writer, ...apiData } = data;
      return postReview({ ...apiData, type });
    },
    {
      onMutate: async (data: any) => {
        const queryKey =
          type.toLowerCase() === "restaurant"
            ? restaurantReviewKeys.list(restaurantId, userId, sortType)
            : restaurantListReviewKeys.list(restaurantId, userId, sortType);

        await queryClient.cancelQueries(queryKey);

        const previousReviewData = queryClient.getQueryData(queryKey);

        const initialData = { pages: [[]] };

        queryClient.setQueryData(queryKey, (oldData: any = initialData) => ({
          ...oldData,
          pages: oldData.pages.map((page: ReviewData[], pageIndex: number) => {
            if (pageIndex === 0) {
              return [
                { ...data, isLoading: true },
                ...page.map((review: ReviewData) => ({ ...review })),
              ];
            }
            return page.map((review: ReviewData) => ({ ...review }));
          }),
        }));

        return { previousReviewData, queryKey };
      },
      onError: (error, data, context: any) => {
        queryClient.setQueryData(context.queryKey, context.previousReviewData);
        showToast("리뷰 등록에 실패하였습니다.", "warning");
      },
      onSuccess: (data, variables) => {
        if (data.message === "현재 정지 상태입니다.") {
          return showToast(
            `${convertUtcToKst(data.banLiftAt)}까지 정지 상태입니다.`,
            "warning"
          );
        }

        const queryKey =
          variables.type.toLowerCase() === "restaurant"
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
      onSettled: (data, error, variables) => {
        const queryKey =
          variables.type.toLowerCase() === "restaurant"
            ? restaurantReviewKeys.list(restaurantId, userId, sortType)
            : restaurantListReviewKeys.list(restaurantId, userId, sortType);

        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};
