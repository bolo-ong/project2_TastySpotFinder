import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRestaurantList } from "apis/restaurantAPI";
import { restaurantListKeys } from "constants/queryKeys";
import { RestaurantList } from "types";

export const usePatchRestaurantListMutation = (id: string) => {
  const queryClient = useQueryClient();
  const queryKey = restaurantListKeys.detail(id);

  return useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      patchRestaurantList(id, data),

    onMutate: async (newData) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({
        queryKey,
      });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<RestaurantList>(queryKey);

      // 낙관적 업데이트
      queryClient.setQueryData<RestaurantList>(queryKey, (old) =>
        old
          ? {
              ...old,
              title: newData.title,
              description: newData.description,
            }
          : undefined
      );

      return { previousData };
    },

    onError: (err, newData, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      queryClient.setQueryData(queryKey, context?.previousData);
    },

    onSettled: () => {
      // 성공/실패 여부와 관계없이 관련 쿼리 무효화
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(["infinityScrollMyRecommended"]);
    },
  });
};
