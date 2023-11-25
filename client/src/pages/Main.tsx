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
    <PageContainer>
      <Header>
        <Navbar />
      </Header>
      <Container>
        <Wrapper>
          <SlotMachine />
        </Wrapper>
        <SearchBar placeholder="추천받은 음식을 검색해 보세요!" />
        <CarouselContainer>
          <RestaurantListCarousel />
          <RestaurantCarousel />
        </CarouselContainer>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-width: 83.75rem;
  margin: 0 auto;
`;

const Header = styled.div`
  width: 80rem;
  margin: 1rem auto 0 auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 80rem;
  margin: 0 auto;
`;

const Wrapper = styled.div`
  margin: 11.25rem 0 2.75rem 0;
`;

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 3.5rem;
  margin-top: 16rem;
`;
