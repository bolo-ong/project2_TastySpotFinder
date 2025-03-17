import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLikeRestaurant } from "apis/userAPI";
import { restaurantKeys, restaurantListKeys } from "constants/queryKeys";

const queryKeyMap = {
  restaurant: (id: string) => restaurantKeys.detail(id),
  restaurantList: (id: string) => restaurantListKeys.detail(id),
};

export const usePatchLikeRestaurantMutation = (
  type: "restaurant" | "restaurantList"
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (restaurantId: string) => {
      await patchLikeRestaurant(type, restaurantId);
    },
    {
      onMutate: async (restaurantId: string) => {
        await queryClient.cancelQueries(["userProfile"]);
        await queryClient.cancelQueries(queryKeyMap[type](restaurantId));

        const userProfile: any = queryClient.getQueryData(["userProfile"]);
        const previousUserData = userProfile ? { ...userProfile } : null;

        const alreadyLiked =
          userProfile?.savedRestaurants.includes(restaurantId);

        const updatedSavedRestaurants = alreadyLiked
          ? userProfile.savedRestaurants.filter(
              (savedId: string) => savedId !== restaurantId
            )
          : [...userProfile.savedRestaurants, restaurantId];

        queryClient.setQueryData(["userProfile"], (oldData: any) => ({
          ...oldData,
          savedRestaurants: updatedSavedRestaurants,
        }));

        queryClient.setQueryData(
          queryKeyMap[type](restaurantId),
          (oldData: any) => ({
            ...oldData,
            like: alreadyLiked ? oldData.like - 1 : oldData.like + 1,
          })
        );

        return { previousUserData, alreadyLiked };
      },
      onError: (error, restaurantId, context: any) => {
        if (context?.previousUserData) {
          queryClient.setQueryData(["userProfile"], context.previousUserData);
        }

        queryClient.setQueryData(
          queryKeyMap[type](restaurantId),
          (oldData: any) => ({
            ...oldData,
            like: context.alreadyLiked ? oldData.like + 1 : oldData.like - 1,
          })
        );
      },
      onSettled: (data, error, restaurantId) => {
        queryClient.invalidateQueries(["userProfile"]);
        queryClient.invalidateQueries(queryKeyMap[type](restaurantId));
      },
    }
  );
};
