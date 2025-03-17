import {
  Card,
  Carousel,
  CardSkeleton,
  DeferredComponent,
  Text,
} from "components";
import { useGetRestaurantsQuery } from "queries";
import { RestaurantList } from "types";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { theme } from "styles/theme";

export const RestaurantListCarousel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const { data, fetchNextPage, hasNextPage, status } = useGetRestaurantsQuery(
    "restaurantList",
    "최신순",
    searchTerm
  );
  const restaurantLists: RestaurantList[][] = data?.pages || [];
  const isEmpty =
    !restaurantLists || restaurantLists.every((page) => page.length === 0);
  const path = searchTerm
    ? `/board/restaurantlist?search=${searchTerm}`
    : "/board/restaurantlist";

  const handleCardClick = (_id?: string) => {
    navigate(`/detail/restaurantList/${_id}`, {
      state: { prevPath: window.location.pathname },
    });
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  if (!(status === "loading") && isEmpty)
    return (
      <EmptyMessageContainer>
        <EmptyMessageContents>
          <Text size={18} weight={800}>
            맛집 리스트
          </Text>
          <EmptyMessage>'{searchTerm}' 에 관련된 리스트가 없어요</EmptyMessage>
        </EmptyMessageContents>
      </EmptyMessageContainer>
    );

  return (
    <Carousel
      carouselItem={restaurantLists}
      handleFetchNextPage={fetchNextPage}
      hasNextPage={Boolean(hasNextPage)}
      title="맛집 리스트"
      path={path}
    >
      {status === "loading"
        ? Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <DeferredComponent>
                <CardSkeleton />
              </DeferredComponent>
            </li>
          ))
        : restaurantLists.map((page: RestaurantList[]) =>
            page
              .filter(
                (restaurantList) =>
                  restaurantList.thumbnail.length > 0 &&
                  !restaurantList.isBlinded
              )
              .map((restaurantList: RestaurantList) => (
                <li key={restaurantList._id}>
                  <Card
                    onClick={() => handleCardClick(restaurantList._id)}
                    title={restaurantList.title}
                    content={restaurantList.description}
                    src={restaurantList.thumbnail}
                    hoverable
                  />
                </li>
              ))
          )}
    </Carousel>
  );
};

const EmptyMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const EmptyMessageContents = styled.div`
  display: flex;
  flex-direction: column;
  width: 68.75rem;

  gap: 1rem;
  margin: 0 0.5rem 0 1.75rem;
  padding-bottom: 3.125rem;
  border-bottom: 0.125rem solid ${theme.colors.gray};
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
  font-size: 1.25rem;
  color: ${theme.colors.gray[6]};
`;
