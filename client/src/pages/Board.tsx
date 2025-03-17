import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
  Navbar,
  BoardTabs,
  SearchBar,
  RestaurantCarousel,
  RestaurantListCarousel,
  InfinityScrollRestaurants,
  InfinityScrollRestaurantLists,
} from "components";

export const Board = () => {
  const { page } = useParams();

  return (
    <PageContainer>
      <Header>
        <Navbar />
        <SearchBarWrapper>
          <SearchBar />
        </SearchBarWrapper>
      </Header>
      <BoardTabs />
      <Container>
        {!page && (
          <CarouselContainer>
            <RestaurantListCarousel />
            <RestaurantCarousel />
          </CarouselContainer>
        )}
        {page === "restaurantlist" && <InfinityScrollRestaurantLists />}
        {page === "restaurant" && <InfinityScrollRestaurants />}
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
  width: 80rem;
  margin: 6.75rem auto 0 auto;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 2.75rem auto;
`;

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  margin-top: 6.75rem;
`;
