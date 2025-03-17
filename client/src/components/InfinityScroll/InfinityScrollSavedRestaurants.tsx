import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useGetSavedRestaurantsQuery } from "queries";
import { Restaurant } from "types";
import {
  Card,
  InfinityScroll,
  CardSkeleton,
  DeferredComponent,
} from "components";
import { theme } from "styles";

export const InfinityScrollSavedRestaurants = () => {
  const navigate = useNavigate();
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetSavedRestaurantsQuery("restaurant");
  const restaurants: Restaurant[][] = data?.pages || [];
  const isEmpty =
    !restaurants || restaurants.every((page) => page.length === 0);

  const handleCardClick = (_id?: string) => {
    navigate(`/detail/restaurant/${_id}`);
  };

  if (!(status === "loading") && isEmpty)
    return <EmptyMessage>저장된 맛집이 없어요</EmptyMessage>;
  return (
    <>
      <InfinityScrollWrapper>
        <InfinityScroll
          handleFetchNextPage={fetchNextPage}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
        >
          {/*처음 로딩 8개의 스켈레톤*/}
          {status === "loading" ? (
            Array.from({ length: 8 }).map((_, index) => (
              <DeferredComponent key={index}>
                <Wrapper>
                  <CardSkeleton />
                </Wrapper>
              </DeferredComponent>
            ))
          ) : (
            <>
              {restaurants.map((page: Restaurant[]) =>
                page.map((restaurant: Restaurant) => (
                  <Wrapper key={restaurant._id}>
                    {restaurant.distance && (
                      <DistanceBadge>
                        <DistanceIndicator distance={restaurant.distance} />
                        {restaurant.distance}
                      </DistanceBadge>
                    )}
                    <Card
                      onClick={() => handleCardClick(restaurant._id)}
                      title={restaurant.name}
                      content={restaurant.location}
                      src={restaurant.img[0]}
                      hoverable
                    />
                  </Wrapper>
                ))
              )}
              {/*다음 리스트를 받아오는 4개의 스켈레톤*/}
              {isFetchingNextPage &&
                Array.from({ length: 4 }).map((_, index) => (
                  <DeferredComponent key={index}>
                    <Wrapper>
                      <CardSkeleton />
                    </Wrapper>
                  </DeferredComponent>
                ))}
            </>
          )}
        </InfinityScroll>
      </InfinityScrollWrapper>
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
`;

const InfinityScrollWrapper = styled.div`
  width: 67.5rem;
  margin: 0 auto;
`;

const DistanceBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.white};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DistanceIndicator = styled.span<{ distance: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ distance }) => {
    const km = parseFloat(distance.replace(" km", ""));
    if (km <= 5) return "#11da11";
    if (km <= 10) return "#ffe900";
    return "#ff4040";
  }};
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
  font-size: 1.25rem;
  color: ${theme.colors.gray[6]};
`;
