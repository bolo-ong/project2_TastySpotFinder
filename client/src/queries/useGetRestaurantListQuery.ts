import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurantList } from "apis/restaurantAPI";

export const useGetRestaurantListQuery = () => {
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
    ["restaurantList"],
    ({ pageParam = 1 }) => getRestaurantList(pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length < 4 ? undefined : pages.length + 1,
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
