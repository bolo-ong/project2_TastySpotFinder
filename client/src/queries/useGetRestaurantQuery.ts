import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurant } from "apis/restaurantAPI";

const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (sortType: string) => [...restaurantKeys.lists(), sortType] as const,
};

export const useGetRestaurantQuery = (sortType: string = "최신순") => {
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
    restaurantKeys.list(sortType || "최신순"),
    ({ pageParam = 1 }) => getRestaurant(pageParam, sortType),
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
