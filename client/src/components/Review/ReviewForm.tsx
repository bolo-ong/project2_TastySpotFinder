import { Text, Button, TextArea } from "components";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { useGetUserProfileDataQuery } from "queries";
import { useState, ChangeEvent, useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { usePostReviewMutation } from "queries/usePostReviewMutation";
import { usePatchReviewMutation } from "queries/usePatchReviewMutation";
import { useRestaurantType } from "hooks";
import { useEscape } from "hooks";

export interface Props {
  sortType: "등록순" | "최신순";
  initialValue?: string;
  reviewId?: string;
  onCancel?: () => void;
}

export const ReviewForm = ({
  sortType,
  initialValue = "",
  reviewId,
  onCancel,
}: Props) => {
  const location = useLocation();
  const type = useRestaurantType();
  const maxLength = 3000;
  const { id } = useParams<string>();
  const { userProfile } = useGetUserProfileDataQuery();
  const [textAreaValue, setTextAreaValue] = useState<string | undefined>(
    initialValue
  );
  const [currentLength, setCurrentLength] = useState<number>(
    initialValue.length
  );
  const postReviewMutation = usePostReviewMutation(
    id!,
    userProfile?._id,
    sortType,
    type
  );
  const patchReviewMutation = usePatchReviewMutation(
    id!,
    userProfile?._id,
    sortType,
    type
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
    setCurrentLength(e.target.value?.length || 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 수정
      if (reviewId) {
        patchReviewMutation.mutate({
          reviewId: reviewId,
          content: textAreaValue,
        });

        // 등록
      } else {
        const data = {
          writer: {
            _id: userProfile?._id,
            displayName: userProfile?.displayName,
            profile_image: userProfile?.profile_image,
          },
          type,
          content: textAreaValue!,
          _id: id!,
        };
        postReviewMutation.mutate(data);
      }
    } catch (err) {
      console.error(err);
    }

    setTextAreaValue("");
    setCurrentLength(0);
    if (onCancel) {
      onCancel();
    }
  };

  useEscape(onCancel);

  return (
    <Container onSubmit={handleSubmit}>
      {userProfile === "Login required" ? (
        <div>
          <StyledLink to={"/login"} state={{ prevPath: location.pathname }}>
            로그인
          </StyledLink>
          <Text size={14} weight={300}>
            하고 리뷰 작성하기
          </Text>
        </div>
      ) : (
        <>
          <FormHeader>
            <Text size={14} weight={500}>
              {userProfile?.displayName}
            </Text>
          </FormHeader>
          <TextArea
            placeholder="댓글을 남겨보세요"
            maxLength={maxLength}
            value={textAreaValue}
            onChange={handleChange}
          />
          <MaxLengthIndicator>
            {currentLength}/{maxLength}
          </MaxLengthIndicator>
          <ButtonWrapper>
            {initialValue && (
              <Button
                size="sm"
                type="button"
                onClick={onCancel}
                variant="outlined"
              >
                취소
              </Button>
            )}
            <Button size="sm" type="submit" disabled={!textAreaValue}>
              {initialValue ? "수정" : "등록"}
            </Button>
          </ButtonWrapper>
        </>
      )}
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border: 0.125rem solid ${theme.colors.gray};
  border-radius: 0.375rem;
  padding: 0.875rem 0.5rem 0.625rem 1rem;
  height: auto;
  min-height: 10.875rem;
`;

const FormHeader = styled.div`
  height: 2.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const MaxLengthIndicator = styled.div`
  padding-top: 0.375rem;
  color: ${theme.colors.gray[2]};
  font-size: 0.75rem;
  font-weight: 300;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-weight: 500;
  font-size: 0.875rem;
`;
