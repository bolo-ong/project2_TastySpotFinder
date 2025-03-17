import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurantReviews } from "apis/reviewAPI";
import {
  restaurantReviewKeys,
  restaurantListReviewKeys,
} from "constants/queryKeys";
import { useGetUserProfileDataQuery } from "queries";
import { useEffect, useState } from "react";

const queryKeyMap = {
  restaurant: restaurantReviewKeys.list,
  restaurantList: restaurantListReviewKeys.list,
};

export const useGetRestaurantReviewsQuery = (
  type: "restaurant" | "restaurantList",
  id: string,
  sortType: string = "등록순"
) => {
  const { userProfile } = useGetUserProfileDataQuery();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (userProfile?._id) {
      setUserId(userProfile?._id);
    }
  }, [userProfile]);

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
    queryKeyMap[type](id, userId, sortType),
    ({ pageParam = 1 }) =>
      getRestaurantReviews(type, pageParam, id, userId, sortType),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length < 4 ? undefined : pages.length + 1;
      },
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
