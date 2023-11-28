import styled from "@emotion/styled";
import {
  RestaurantCarousel,
  RestaurantListCarousel,
  InfinityScrollRestaurant,
  InfinityScrollRestaurantList,
} from "components";
import { useRecoilState } from "recoil";
import { boardTabState } from "recoil/atoms";

export const BoardContainerItem = () => {
  const [selectedTab] = useRecoilState(boardTabState);
  return (
    <>
      {selectedTab.title === "한번에 보기" && (
        <CarouselContainer>
          <RestaurantListCarousel />
          <RestaurantCarousel />
        </CarouselContainer>
      )}
      {selectedTab.title === "리스트로 보기" && (
        <InfinityScrollRestaurantList />
      )}
      {selectedTab.title === "하나씩 보기" && <InfinityScrollRestaurant />}
    </>
  );
};

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 3.5rem;
  margin-top: 6.75rem;
`;
