import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { userLogOut } from "apis/authAPI";
import { useState, useEffect } from "react";
import { useGetUserProfileDataQuery } from "queries";
import {
  useLocation,
  Link,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Image,
  Avatar,
  Button,
  Dropdown,
  Menu,
  LocationSwitch,
} from "components";
import { MenuItem } from "types";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userProfile, getUserProfileDataSuccess, getUserProfileDataLoading } =
    useGetUserProfileDataQuery();
  const menuItems: MenuItem[] = [
    // { title: "저장한 리스트", path: "/saved-restaurants-list" },
    // { title: "저장한 맛집", path: "/saved-restaurants" },
    { title: "마이페이지", path: "/my-page/posts" },
    { title: "로그아웃", onClick: () => userLogOut(userProfile.provider) },
  ];

  const [selectedMenuItem, setSelectedMenuItem] = useState<
    MenuItem | undefined
  >();

  useEffect(() => {
    const menuItem: MenuItem | undefined = menuItems.find(
      (menuItem) => location.pathname === menuItem.path
    );
    setSelectedMenuItem(menuItem);
  }, [location.pathname]);

  const handleMenuClick = (menuItem: MenuItem | undefined) => {
    if (menuItem === selectedMenuItem) return;
    setSelectedMenuItem(menuItem);
    menuItem?.onClick && menuItem.onClick();
    menuItem?.path && navigate(menuItem.path);
  };

  const resetSearchParams = () => {
    setSearchParams({});
  };

  return (
    <Container>
      <LeftContainer>
        <Image
          as={Link}
          to="/"
          width="28"
          height="28"
          name="logo_main"
          extension="png"
        />
        <StyledLink to="/board" onClick={resetSearchParams}>
          맛집보기
        </StyledLink>
      </LeftContainer>

      <RightContainer>
        <LocationSwitch />
        {getUserProfileDataSuccess ? (
          userProfile?.displayName ? (
            <LoginItemWrapper>
              <Dropdown
                top={40}
                trigger={
                  getUserProfileDataLoading ? (
                    <Avatar size="36" />
                  ) : (
                    <Avatar
                      size="36"
                      src={userProfile.profile_image}
                      hoverable
                    />
                  )
                }
              >
                <Menu
                  items={menuItems}
                  onClick={handleMenuClick}
                  selectedMenu={selectedMenuItem?.title}
                />
              </Dropdown>
            </LoginItemWrapper>
          ) : (
            <LoginItemWrapper>
              <StyledLink to="/Login" state={{ prevPath: location.pathname }}>
                로그인
              </StyledLink>
            </LoginItemWrapper>
          )
        ) : (
          <LoginItemWrapper />
        )}
        <Button as={Link} to="/posting">
          맛집추천하기
        </Button>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 67.75rem;
  height: 2.5rem;
  padding: 0 1rem 0 1.25rem;
  margin: 0 auto;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
`;

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.black};

  &:hover {
    color: ${theme.colors.main[5]};
  }
`;

const LoginItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 2.5rem;
`;
