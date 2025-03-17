import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfinityScrollRestaurants } from "apis/restaurantAPI";
import { restaurantKeys, restaurantListKeys } from "constants/queryKeys";

const queryKeyMap = {
  restaurant: restaurantKeys.list,
  restaurantList: restaurantListKeys.list,
};

export const useGetRestaurantsQuery = (
  type: "restaurant" | "restaurantList",
  sortType?: string,
  searchTerm?: string,
  coordinates?: { longitude: number; latitude: number } | null
) => {
  const queryKey = queryKeyMap[type](sortType || "enabled", searchTerm || "");
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
    ({ pageParam = 1 }) =>
      getInfinityScrollRestaurants(
        type,
        pageParam,
        sortType,
        coordinates,
        searchTerm
      ),
    {
      enabled:
        !!sortType &&
        (sortType !== "가까운순" ||
          (coordinates !== undefined && coordinates !== null)),
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
