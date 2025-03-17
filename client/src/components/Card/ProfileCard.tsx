import styled from "@emotion/styled";
import { useState } from "react";
import { Avatar, Text, Dropdown, Menu, Image, WarningModal } from "components";
import { theme } from "styles/theme";
import { User, MenuItem } from "types";
import { useDeleteUserProfileMutation } from "queries/useDeleteUserProfileMutation";

export interface Props {
  userProfile: User;
}

export const ProfileCard = ({ userProfile }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteProfile } = useDeleteUserProfileMutation();

  const menuItems: MenuItem[] = [
    {
      title: "삭제",
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  const handleMenuClick = (menuItem: MenuItem | undefined) => {
    menuItem?.onClick && menuItem.onClick();
  };

  const handleDelete = () => {
    deleteProfile();
    setIsDeleteModalOpen(false);
  };

  return (
    <Container>
      <Avatar size="64" src={userProfile.profile_image} />
      <Contents>
        <Header>
          <Text size={16} weight={600}>
            {userProfile.displayName}
          </Text>
          <Dropdown
            top={12}
            trigger={
              <Image name="icon_more" width="18" height="18" extension="svg" />
            }
          >
            <Menu items={menuItems} onClick={handleMenuClick} />
          </Dropdown>
        </Header>

        <Text size={14} color={theme.colors.gray[9]}>
          {`${userProfile.recommendedRestaurantListsCount || 0}개의 리스트,
          ${userProfile.recommendedRestaurantsCount || 0}개의 맛집 추천, ${
            userProfile.receivedLikes || 0
          }개 공감받음`}
        </Text>
      </Contents>

      {isDeleteModalOpen && (
        <WarningModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          warningText="정말 프로필을 삭제하시겠습니까?"
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin-top: 6rem;
  gap: 1rem;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
