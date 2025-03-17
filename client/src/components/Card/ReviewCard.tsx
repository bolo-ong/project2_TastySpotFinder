import styled from "@emotion/styled";
import { theme } from "styles";
import { ReviewData } from "types";
import { Text } from "../Text";

interface Props {
  review: ReviewData;
  isSelected: boolean;
  onCheckboxChange: (reviewId: string) => void;
  onReviewClick: (review: ReviewData) => void;
}

export const ReviewCard = ({
  review,
  isSelected,
  onCheckboxChange,
  onReviewClick,
}: Props) => {
  return (
    <Container>
      <ReviewContent>
        <ReviewHeader>
          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              checked={isSelected}
              onChange={() => onCheckboxChange(review._id)}
              onClick={(e) => e.stopPropagation()}
            />
          </CheckboxWrapper>
          <ContentWrapper onClick={() => onReviewClick(review)}>
            <ReviewTitle size={16}>{review.content}</ReviewTitle>
            <DateText size={14} color={theme.colors.gray[5]}>
              {new Date(review.createdAt).toLocaleDateString()}
            </DateText>
            <TargetInfo>
              <TypeBadge>
                <Text size={12} weight={500}>
                  {review.type === "restaurant" ? "맛집" : "리스트"}
                </Text>
              </TypeBadge>
              <TargetText size={14} color={theme.colors.gray[7]}>
                {review.type === "restaurant"
                  ? review.restaurant?.name
                  : review.restaurantList?.title}
              </TargetText>
              <LikeText size={14} color={theme.colors.gray[6]}>
                좋아요 {review.likeCount}
              </LikeText>
            </TargetInfo>
          </ContentWrapper>
        </ReviewHeader>
      </ReviewContent>
    </Container>
  );
};

const Container = styled.article`
  position: relative;
  display: flex;
  width: 100%;
  padding: 1.5rem 0;
  transition: all 0.2s ease-in-out;
  border: none;
  border-radius: 0;
`;

const ReviewContent = styled.div`
  flex: 1;
  display: flex;
`;

const ReviewHeader = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
`;

const CheckboxWrapper = styled.div`
  padding-top: 0.25rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  flex: 1;
  cursor: pointer;

  &:hover {
    > span:first-of-type {
      text-decoration: underline;
      text-underline-position: under;
    }
  }
`;

const TargetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TypeBadge = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background-color: ${theme.colors.main[0]};
`;

const ReviewTitle = styled(Text)`
  margin-bottom: 0.25rem;
`;

const DateText = styled(Text)`
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TargetText = styled(Text)``;

const LikeText = styled(Text)`
  margin-left: auto;
`;
