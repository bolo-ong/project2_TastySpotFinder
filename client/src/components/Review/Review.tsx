import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "hooks/useToast";
import { theme } from "styles/theme";
import { ReviewData, MenuItem } from "types";
import {
  Avatar,
  Text,
  Button,
  Image,
  Dropdown,
  Menu,
  ReviewForm,
  WarningModal,
} from "components";
import styled from "@emotion/styled";
import {
  usePatchReportContentMutation,
  useGetUserProfileDataQuery,
  usePatchLikeReviewMutation,
  useDeleteReviewMutation,
} from "queries";

export interface Props {
  reviewData: ReviewData;
  sortType: "등록순" | "최신순";
  type: "restaurant" | "restaurantList";
}

export const Review = ({ reviewData, sortType, type }: Props) => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { userProfile } = useGetUserProfileDataQuery();
  const reviewer = reviewData?.writer;
  const isMine = userProfile?._id === reviewer?._id;
  const alreadyLike = reviewData.like?.includes(userProfile._id);
  const canDeleteUser = ["admin", "moderator"].includes(userProfile?.role);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(
    !reviewData.isBlinded
  );
  const { mutate: patchReportContentMutate } = usePatchReportContentMutation();
  const { mutate: deleteReviewMutate } = useDeleteReviewMutation(
    id!,
    userProfile?._id,
    sortType,
    type
  );
  const { mutate: patchLikeReviewMutate } = usePatchLikeReviewMutation(
    id!,
    userProfile?._id,
    sortType,
    type
  );

  const menuItems: MenuItem[] = [
    ...(isMine
      ? [{ title: "수정", onClick: () => setIsEditing(true) }]
      : [
          {
            title: "신고",
            onClick: () =>
              patchReportContentMutate({
                contentType: "review",
                contentId: reviewData._id,
              }),
          },
        ]),
    ...(isMine || canDeleteUser
      ? [{ title: "삭제", onClick: () => setIsModalOpen(true) }]
      : []),
  ];

  const handleMenuClick = (menuItem: MenuItem | undefined) => {
    menuItem?.onClick && menuItem.onClick();
  };

  const handleLikeButtonClick = () => {
    if (!userProfile?._id) return showToast("로그인 후 이용해 주세요.", "info");
    patchLikeReviewMutate(reviewData._id);
  };

  const handleDeleteReview = () => {
    deleteReviewMutate(reviewData._id);
    setIsModalOpen(false);
  };

  const handleShowContentClick = () => {
    setShowContent(true);
  };

  return (
    <>
      {reviewer && (
        <Container isMine={isMine} isEditing={isEditing}>
          {reviewData.isLoading ? (
            <ImageWrapper>
              <Image
                name="icon_spinner"
                width="96"
                height="96"
                extension="svg"
              />
            </ImageWrapper>
          ) : isEditing ? (
            <ReviewForm
              sortType={sortType}
              initialValue={reviewData.content}
              reviewId={reviewData._id}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <ReviewHeader>
                <Avatar src={reviewer.profile_image} size="36" />
                <TextWrapper>
                  <Text size={14} weight={500}>
                    {reviewer.displayName}
                  </Text>
                  <Text size={13} color={theme.colors.gray[9]}>
                    {`${
                      userProfile.recommendedRestaurantListsCount || 0
                    }개의 리스트,
          ${userProfile.recommendedRestaurantsCount || 0}개의 맛집 추천, ${
                      userProfile.receivedLikes || 0
                    }개 공감받음`}
                  </Text>
                </TextWrapper>
                <Dropdown
                  top={12}
                  trigger={
                    <Image
                      name="icon_more"
                      width="16"
                      height="16"
                      extension="svg"
                    />
                  }
                >
                  <Menu items={menuItems} onClick={handleMenuClick} />
                </Dropdown>
              </ReviewHeader>
              <ReviewContent>
                {reviewData.isBlinded && !showContent ? (
                  <Text size={14} color={theme.colors.gray[6]}>
                    블라인드 처리된 댓글입니다.{" "}
                    <ShowContentButton onClick={handleShowContentClick}>
                      [내용 보기]
                    </ShowContentButton>
                  </Text>
                ) : (
                  <Text size={14}>{reviewData.content}</Text>
                )}
              </ReviewContent>
              <ButtonWrapper>
                <Button
                  variant={alreadyLike ? "filled" : "outlined"}
                  size="sm"
                  onClick={handleLikeButtonClick}
                >
                  {`도움됐어요 ${reviewData.likeCount || 0}`}
                </Button>
              </ButtonWrapper>
            </>
          )}
        </Container>
      )}

      {isModalOpen && (
        <WarningModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteReview}
          warningText="정말 이 리뷰를 삭제하시겠습니까?"
        />
      )}
    </>
  );
};

const Container = styled.div<{ isMine: boolean; isEditing: boolean }>`
  position: relative;
  width: 100%;
  border-radius: 0.375rem;
  padding: 1rem 0.625rem 0.75rem 1.125rem;
  min-height: 10.875rem;

  ${({ isMine }) =>
    isMine &&
    `
    background-color: ${theme.colors.success[0]};
    `}
  ${({ isEditing }) =>
    isEditing &&
    `
    padding: 0;
    `};
`;

const ReviewHeader = styled.div`
  height: 2.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const ReviewContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.125rem;
  width: 51.875rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 1.125rem;
`;

const ShowContentButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.main[5]};
  cursor: pointer;
  text-decoration: underline;
`;
