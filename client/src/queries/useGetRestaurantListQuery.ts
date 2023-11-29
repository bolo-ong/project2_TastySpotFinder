import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurantList } from "apis/restaurantAPI";

const restaurantListKeys = {
  all: ["restaurantLists"] as const,
  lists: () => [...restaurantListKeys.all, "list"] as const,
  list: (sortType: string) =>
    [...restaurantListKeys.lists(), sortType] as const,
};

export const useGetRestaurantListQuery = (sortType: string = "최신순") => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    restaurantListKeys.list(sortType || "최신순"),
    ({ pageParam = 1 }) => getRestaurantList(pageParam, sortType),
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
  };
};
