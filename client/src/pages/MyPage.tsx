import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
  Navbar,
  MyPageTabs,
  ProfileCard,
  InfinityScrollMyRecommended,
  InfinityScrollSavedRestaurants,
  InfinityScrollSavedRestaurantLists,
  InfinityScrollMyReviews,
} from "components";
import { useGetUserProfileDataQuery } from "queries";

export const MyPage = () => {
  const { userProfile } = useGetUserProfileDataQuery();
  const { page } = useParams();

  return (
    <PageContainer>
      <Header>
        <Navbar />
      </Header>
      <Container>
        <ProfileCard userProfile={userProfile} />
        <MyPageTabs />
        <div>
          {page === "posts" && <InfinityScrollMyRecommended />}
          {page === "comments" && <InfinityScrollMyReviews />}
          {page === "saved-restaurant-lists" && (
            <InfinityScrollSavedRestaurantLists />
          )}
          {page === "saved-restaurants" && <InfinityScrollSavedRestaurants />}
        </div>
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

  width: 67.5rem;
  margin: 0 auto;

  > :first-of-type {
    margin-bottom: 2rem;
  }

  > :nth-of-type(2) {
    margin-bottom: 6.75rem;
  }
`;
