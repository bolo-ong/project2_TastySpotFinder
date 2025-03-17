import { InfinityScroll, ReviewSkeleton, DeferredComponent } from "components";
import { ReviewData } from "types";
import { useGetRestaurantReviewsQuery } from "queries";
import { useParams } from "react-router-dom";
import { Review } from "../Review/Review";
import { useRestaurantType } from "hooks";

export interface Props {
  sortType: "등록순" | "최신순";
}

export const InfinityScrollReview = ({ sortType }: Props) => {
  const type = useRestaurantType();
  const { id } = useParams();
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useGetRestaurantReviewsQuery(type, id!, sortType);
  const reviews: ReviewData[][] = data?.pages || [];

  return (
    <InfinityScroll
      handleFetchNextPage={fetchNextPage}
      isFetching={isFetching}
      hasNextPage={hasNextPage}
    >
      {status === "loading"
        ? Array.from({ length: 8 }).map((_, index) => (
            <DeferredComponent key={index}>
              <ReviewSkeleton />
            </DeferredComponent>
          ))
        : reviews.map((page) =>
            page.map((review) => (
              <Review
                key={review._id}
                reviewData={review}
                sortType={sortType}
                type={type}
              />
            ))
          )}
      {isFetchingNextPage &&
        Array.from({ length: 8 }).map((_, index) => (
          <DeferredComponent key={index}>
            <ReviewSkeleton />
          </DeferredComponent>
        ))}
    </InfinityScroll>
  );
};
