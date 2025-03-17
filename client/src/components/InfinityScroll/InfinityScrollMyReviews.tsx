import styled from "@emotion/styled";
import { useGetMyReviewsQuery, useDeleteMyReviewMutation } from "queries";
import { ReviewData } from "types";
import {
  InfinityScroll,
  DeferredComponent,
  Button,
  Image,
  ReviewCard,
} from "components";
import { theme } from "styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const InfinityScrollMyReviews = () => {
  const navigate = useNavigate();
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
    new Set()
  );
  const deleteMyReviewMutation = useDeleteMyReviewMutation();
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetMyReviewsQuery();

  const reviews = data?.pages.map((page) => page.reviews).flat() || [];
  const isEmpty = reviews.length === 0;

  const handleReviewClick = (review: ReviewData) => {
    const path =
      review.type === "restaurant"
        ? `/detail/restaurant/${review.restaurant?._id}`
        : `/detail/restaurantList/${review.restaurantList?._id}`;

    navigate(path);
  };

  const handleCheckboxChange = (reviewId: string) => {
    setSelectedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedReviews.size === 0) return;

    try {
      for (const reviewId of selectedReviews) {
        await deleteMyReviewMutation.mutateAsync(reviewId);
      }
      setSelectedReviews(new Set());
    } catch (error) {
      console.error("Failed to delete reviews:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedReviews.size === reviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews.map((review) => review._id)));
    }
  };

  if (!(status === "loading") && isEmpty)
    return <EmptyMessage>작성한 리뷰가 없어요</EmptyMessage>;

  return (
    <InfinityScrollWrapper>
      <HeaderActions>
        <ActionButtons>
          <Button variant="outlined" size="sm" onClick={handleSelectAll}>
            {selectedReviews.size === reviews.length
              ? "전체 해제"
              : "전체 선택"}
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedReviews.size === 0}
          >
            {selectedReviews.size}개 삭제
          </Button>
        </ActionButtons>
      </HeaderActions>
      <InfinityScroll
        handleFetchNextPage={fetchNextPage}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
      >
        {status === "loading" ? (
          <DeferredComponent>
            <LoadingWrapper>
              <Image
                name="icon_spinner"
                width="96"
                height="96"
                extension="svg"
              />
            </LoadingWrapper>
          </DeferredComponent>
        ) : (
          <>
            {reviews.map((review: ReviewData) => (
              <Wrapper key={review._id}>
                <ReviewCard
                  review={review}
                  isSelected={selectedReviews.has(review._id)}
                  onCheckboxChange={handleCheckboxChange}
                  onReviewClick={handleReviewClick}
                />
              </Wrapper>
            ))}
            {isFetchingNextPage && (
              <DeferredComponent>
                <LoadingWrapper>
                  <Image
                    name="icon_spinner"
                    width="96"
                    height="96"
                    extension="svg"
                  />
                </LoadingWrapper>
              </DeferredComponent>
            )}
          </>
        )}
      </InfinityScroll>
    </InfinityScrollWrapper>
  );
};

const Wrapper = styled.div`
  width: 67.5rem;
  border-bottom: 1px solid ${theme.colors.gray[2]};

  &:first-of-type {
    border-top: 1px solid ${theme.colors.gray[2]};
  }
`;

const InfinityScrollWrapper = styled.div`
  width: 67.5rem;
  margin: 0 auto;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
  font-size: 1.25rem;
  color: ${theme.colors.gray[6]};
`;

const HeaderActions = styled.div`
  width: 67.5rem;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  padding: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
`;
