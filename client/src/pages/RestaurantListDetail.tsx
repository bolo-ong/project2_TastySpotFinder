import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { Navbar, ListNaverMapSection, ReviewSection } from "components";
import { useGetRestaurantDetailQuery } from "queries";

export const RestaurantListDetail = () => {
  const { id } = useParams();
  const { restaurantDetail } = useGetRestaurantDetailQuery(
    "restaurantList",
    id!
  );

  return (
    <PageContainer>
      <Header>
        <Navbar />
      </Header>
      {restaurantDetail && (
        <Container>
          <ListNaverMapSection restaurantDetail={restaurantDetail} />
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
  width: 67.5rem;
  margin: 6.75rem auto 0 auto;
`;
