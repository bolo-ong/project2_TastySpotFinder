import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurant } from "apis/restaurantAPI";

export const useGetRestaurantQuery = () => {
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
    ["restaurant"],
    ({ pageParam = 1 }) => getRestaurant(pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length < 4 ? undefined : pages.length + 1,

      refetchOnMount: false,
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
