import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfinityScrollMyRecommended } from "apis/restaurantAPI";

export const useGetMyRecommendedQuery = () => {
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
    ["myRecommendedRestaurants"],
    ({ pageParam = 1 }) => getInfinityScrollMyRecommended(pageParam),
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
