import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
  Navbar,
  InfoSection,
  MenuSection,
  ReviewSection,
  NaverMapSection,
} from "components";
import { Restaurant } from "types";
import { useNearbyRestaurants } from "hooks";
import { useGetRestaurantDetailQuery } from "queries";

export const RestaurantDetail = () => {
  const { id } = useParams();
  const { restaurantDetail } = useGetRestaurantDetailQuery(
    "restaurant",
    id!
  ) as {
    restaurantDetail: Restaurant;
  };
  const nearbyRestaurants: Restaurant[] | null =
    useNearbyRestaurants(restaurantDetail);

  return (
    <PageContainer>
      <Header>
        <Navbar />
      </Header>

      {restaurantDetail && (
        <Container>
          <InfoSection restaurantDetail={restaurantDetail} />

          {nearbyRestaurants && (
            <NaverMapSection
              nearbyRestaurants={nearbyRestaurants}
            ></NaverMapSection>
          )}

          <MenuSection restaurantDetail={restaurantDetail} />
          <ReviewSection />
        </Container>
      )}
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
  width: 67.5rem;
  margin: 4.5rem auto 0 auto;
  padding-bottom: 4.5rem;
`;
