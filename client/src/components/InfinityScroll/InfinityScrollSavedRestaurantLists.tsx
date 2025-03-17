import styled from "@emotion/styled";
import { useGetSavedRestaurantsQuery } from "queries";
import { RestaurantList } from "types";
import {
  Card,
  InfinityScroll,
  CardSkeleton,
  DeferredComponent,
} from "components";

import { useNavigate } from "react-router-dom";
import { theme } from "styles";

export const InfinityScrollSavedRestaurantLists = () => {
  const navigate = useNavigate();
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetSavedRestaurantsQuery("restaurantList");
  const restaurantLists: RestaurantList[][] = data?.pages || [];
  const isEmpty =
    !restaurantLists || restaurantLists.every((page) => page.length === 0);

  const handleCardClick = (_id?: string) => {
    navigate(`/detail/restaurantList/${_id}`, {
      state: { prevPath: window.location.pathname },
    });
  };

  if (!(status === "loading") && isEmpty)
    return <EmptyMessage>저장된 맛집 리스트가 없어요</EmptyMessage>;
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
              {restaurantLists.map((page: RestaurantList[]) =>
                page
                  .filter(
                    (restaurantList) =>
                      restaurantList.thumbnail.length > 0 &&
                      !restaurantList.isBlinded
                  )
                  .map((restaurantList: RestaurantList) => (
                    <Wrapper key={restaurantList._id}>
                      <Card
                        onClick={() => handleCardClick(restaurantList._id)}
                        title={restaurantList.title}
                        content={restaurantList.description}
                        src={restaurantList.thumbnail}
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
  margin-bottom: 2.5rem;
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
