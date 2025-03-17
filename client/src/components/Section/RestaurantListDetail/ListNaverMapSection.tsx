import { useState, useRef } from "react";
import styled from "@emotion/styled";
import {
  Avatar,
  VerticalCard,
  Button,
  Text,
  Image,
  BookMarkButton,
  CopyUrlButton,
  Dropdown,
  Menu,
  WarningModal,
} from "components";
import { Restaurant, RestaurantList, MenuItem } from "types";
import { useNaverMap } from "hooks";
import { theme } from "styles";
import {
  useGetUserProfileDataQuery,
  usePatchLikeRestaurantMutation,
  usePatchReportContentMutation,
  usePatchRestaurantListMutation,
} from "queries";
import { useToast } from "hooks";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { AxiosError } from "axios";
import { deleteRestaurantList } from "apis/restaurantAPI";

interface Props {
  restaurantDetail: RestaurantList;
}

export const ListNaverMapSection = ({ restaurantDetail }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const prevPath = location.state?.prevPath || "/";
  const { id } = useParams();
  const restaurants = restaurantDetail.restaurants!;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // URL의 쿼리 파라미터에서 visibleCount를 가져옴
  const [visibleCount, setVisibleCount] = useState(() => {
    const count = searchParams.get("count");
    return count ? parseInt(count) : 4;
  });

  const { mapInstance, markers } = useNaverMap({
    containerId: "map",
    data: restaurants,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(restaurantDetail.title);
  const [editedDescription, setEditedDescription] = useState(
    restaurantDetail.description
  );

  const likeRestaurantMutation =
    usePatchLikeRestaurantMutation("restaurantList");
  const { userProfile } = useGetUserProfileDataQuery();
  const isMine = userProfile?._id === restaurantDetail.writer?._id;
  const isSavedRestaurant = userProfile?.savedRestaurantLists?.includes(id);
  const { showToast } = useToast();
  const canDeleteUser = ["admin", "moderator"].includes(userProfile?.role);
  const { mutate: patchReportContentMutate } = usePatchReportContentMutation();
  const { mutate: postRestaurantListMutate } = usePatchRestaurantListMutation(
    restaurantDetail._id
  );
  const menuItems: MenuItem[] = [
    ...(isMine
      ? [
          {
            title: "수정",
            onClick: () => setIsEditing(true),
          },
        ]
      : [
          {
            title: "신고",
            onClick: () =>
              patchReportContentMutate({
                contentType: "restaurantList",
                contentId: restaurantDetail._id,
              }),
          },
        ]),
    ...(isMine || canDeleteUser
      ? [{ title: "삭제", onClick: () => setIsModalOpen(true) }]
      : []),
  ];

  const handleShowMore = () => {
    // 현재 스크롤 위치 저장
    const currentScrollPosition = window.scrollY;

    const newCount = visibleCount + 4;
    setVisibleCount(newCount);
    searchParams.set("count", newCount.toString());
    setSearchParams(searchParams, { replace: true });

    // 다음 렌더링 사이클에서 스크롤 위치 복원
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
    });
  };

  const handleMenuClick = (menuItem: MenuItem | undefined) => {
    menuItem?.onClick && menuItem.onClick();
  };

  const handleBookMarkButtonClick = () => {
    userProfile === "Login required"
      ? showToast("로그인 후 이용해 주세요.", "info")
      : likeRestaurantMutation.mutate(id!);
  };

  const handleDeleteReview = async () => {
    try {
      const res = await deleteRestaurantList(restaurantDetail._id);
      showToast(res.message, "success");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "삭제 중 오류가 발생했습니다.";
      showToast(errorMessage, "warning");
    } finally {
      setIsModalOpen(false);
      navigate(prevPath, { replace: true });
    }
  };

  const handleUpdateReview = async () => {
    try {
      await postRestaurantListMutate({
        title: editedTitle,
        description: editedDescription || "",
      });
      setIsEditing(false);
      showToast("수정이 완료되었습니다.", "success");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "수정 중 오류가 발생했습니다.";
      showToast(errorMessage, "warning");
    }
  };

  const isContentChanged = () => {
    return (
      editedTitle !== restaurantDetail.title ||
      editedDescription !== restaurantDetail.description
    );
  };

  return (
    <Section>
      <VerticalCardContainer ref={containerRef}>
        <Header>
          <DropdownWrapper>
            <Dropdown
              top={12}
              trigger={
                <Image
                  name="icon_more"
                  width="18"
                  height="18"
                  extension="svg"
                />
              }
            >
              <Menu items={menuItems} onClick={handleMenuClick} />
            </Dropdown>
          </DropdownWrapper>

          <ButtonContainer>
            <BookMarkButton
              onClick={handleBookMarkButtonClick}
              isSaved={isSavedRestaurant}
              count={restaurantDetail.like}
            />
            <CopyUrlButton />
          </ButtonContainer>
          <InfoContainer>
            <CountWrapper>
              <Image
                width={14}
                height={14}
                name="icon_restaurant"
                extension="svg"
              ></Image>
              <Text size={14} weight={300}>
                {restaurantDetail.restaurants?.length}개
              </Text>
            </CountWrapper>
            <ProfileContainer>
              <Avatar size={28} src={restaurantDetail.writer?.profile_image} />
              <Text size={14} weight={300}>
                {restaurantDetail.writer?.displayName}
              </Text>
            </ProfileContainer>
          </InfoContainer>
          {isEditing ? (
            <>
              <EditableText
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
              />
              <EditableDescription
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              <ButtonGroup>
                <Button
                  size="sm"
                  onClick={handleUpdateReview}
                  disabled={!isContentChanged()}
                >
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => {
                    setEditedTitle(restaurantDetail.title);
                    setEditedDescription(restaurantDetail.description);
                    setIsEditing(false);
                  }}
                >
                  취소
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Text size={18} weight={500}>
                {restaurantDetail.title}
              </Text>
              <DescriptionWrapper>
                <Text>{restaurantDetail.description}</Text>
              </DescriptionWrapper>
            </>
          )}
        </Header>

        {restaurants
          .slice(0, visibleCount)
          .map((restaurant: Restaurant, index: number) => (
            <VerticalCard
              key={index}
              index={index}
              restaurant={restaurant}
              mapInstance={mapInstance}
              markers={markers}
            />
          ))}
        {visibleCount < restaurants.length && (
          <Button wide onClick={handleShowMore}>
            추천식당 더 보기
          </Button>
        )}
      </VerticalCardContainer>

      <NaverMapWrapper>
        <StickyMap>
          <NaverMap id="map" />
        </StickyMap>
      </NaverMapWrapper>

      {isModalOpen && (
        <WarningModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteReview}
          warningText="정말 삭제하시겠습니까?"
        />
      )}
    </Section>
  );
};

const Section = styled.div`
  display: flex;
  margin: auto;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  border: 0.0625rem solid ${theme.colors.gray[0]};
  padding: 2rem;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const ButtonContainer = styled.div`
  gap: auto;
  display: flex;
  align-items: center;
  height: fit-content;
  gap: 0.875rem;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const DescriptionWrapper = styled.div`
  text-align: center;
  width: 25rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const VerticalCardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NaverMapWrapper = styled.div`
  width: 100%;
`;

const NaverMap = styled.div`
  height: 100vh;
`;

const StickyMap = styled.div`
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const EditableText = styled.input`
  width: 25rem;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  &:focus {
    outline: none;
  }
`;

const EditableDescription = styled.textarea`
  width: 25rem;
  text-align: center;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
`;
