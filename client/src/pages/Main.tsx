import styled from "@emotion/styled";
import {
  Navbar,
  SearchBar,
  SlotMachine,
  RestaurantListCarousel,
  RestaurantCarousel,
} from "components";

export const Main = () => {
  return (
    <Container>
      <Navbar />
      <Wrapper>
        <SlotMachine />
      </Wrapper>
      <SearchBar placeholder="추천받은 음식을 검색해 보세요!" />
      <CarouselContainer>
        <RestaurantListCarousel />
        <RestaurantCarousel />
      </CarouselContainer>
    </Container>
  );
};

const Container = styled.div`
  min-width: 83.75rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: 11.25rem 0 2.75rem 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 3.125rem;
  font-size: 2rem;
  font-weight: 600;
`;

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 80rem;
  gap: 3.5rem;
  margin-top: 16rem;
`;
