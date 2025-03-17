import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfinityScrollSavedRestaurants } from "apis/restaurantAPI";
import { restaurantKeys, restaurantListKeys } from "constants/queryKeys";

const queryKeyMap = {
  restaurant: restaurantKeys.savedRestaurants,
  restaurantList: restaurantListKeys.savedRestaurantLists,
};

export const useGetSavedRestaurantsQuery = (
  type: "restaurant" | "restaurantList"
) => {
  const queryKey = queryKeyMap[type]();
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery(
    queryKey,
    ({ pageParam = 1 }) => getInfinityScrollSavedRestaurants(type, pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length < 4 ? undefined : pages.length + 1,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  };
};
