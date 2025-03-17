import { useState } from "react";
import styled from "@emotion/styled";
import {
  Text,
  ReviewForm,
  InfinityScrollReview,
  RestaurantDetailTabs,
} from "components";

export const ReviewSection = () => {
  const [sortType, setSortType] = useState<"등록순" | "최신순">("등록순");

  return (
    <Section>
      <Container>
        <Text size={18} weight={600}>
          리뷰
        </Text>

        <ReviewTabWrapper>
          <RestaurantDetailTabs onClick={(tab) => setSortType(tab)} />
        </ReviewTabWrapper>

        <ReviewWrapper>
          <ReviewForm sortType={sortType} />
          <InfinityScrollReview sortType={sortType} />
        </ReviewWrapper>
      </Container>
    </Section>
  );
};

const Section = styled.section``;

const Container = styled.div`
  width: 56.25rem;
  margin: 6rem auto 0 auto;

  > span:nth-of-type(1) {
    display: inline-block;
    margin-bottom: 2rem;
  }
`;

const ReviewTabWrapper = styled.div`
  margin-bottom: 2rem;
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1.3125rem 0 1.3125rem;
  gap: 2rem;
`;
