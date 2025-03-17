import { useQuery } from "@tanstack/react-query";
import { getRestaurant } from "apis/restaurantAPI";
import { restaurantKeys, restaurantListKeys } from "constants/queryKeys";

const queryKeyMap = {
  restaurant: restaurantKeys.detail,
  restaurantList: restaurantListKeys.detail,
};

export const useGetRestaurantDetailQuery = (
  type: "restaurant" | "restaurantList",
  id: string
) => {
  const queryKey = queryKeyMap[type](id);
  const {
    error: getRestaurantDetailDataError,
    data: restaurantDetail,
    isSuccess: getRestaurantDetailDataSuccess,
    isLoading: getRestaurantDetailDataLoading,
  } = useQuery(queryKey, () => getRestaurant(type, id), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return {
    getRestaurantDetailDataError,
    restaurantDetail,
    getRestaurantDetailDataSuccess,
    getRestaurantDetailDataLoading,
  };
};
