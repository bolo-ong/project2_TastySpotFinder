import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyReviews } from "apis/reviewAPI";

export const useGetMyReviewsQuery = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery(
    ["myReviews"],
    ({ pageParam = 1 }) => getMyReviews(pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.reviews.length < 4 ? undefined : pages.length + 1,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  };
};
