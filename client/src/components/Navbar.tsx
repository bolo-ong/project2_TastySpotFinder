import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { useLocation, Link } from "react-router-dom";
import { userLogOut } from "apis/authAPI";
import { useGetUserProfileDataQuery } from "queries";
import { Image, Avatar, Button, DropdownMenu, MenuItem } from "components";

export const Navbar = () => {
  const location = useLocation();
  const { userProfile, getUserProfileDataSuccess } =
    useGetUserProfileDataQuery();
  console.log(userProfile);

  const menuItems = [
    { component: <Link to="/">저장한 리스트</Link> },
    { component: <Link to="/board">저장한 맛집</Link> },
    { component: <Link to="#">나의 맛집</Link> },
    {
      component: (
        <button onClick={() => userLogOut(userProfile.provider)}>
          로그아웃
        </button>
      ),
    },
  ];

  return (
    <Container>
      <Image
        as={Link}
        to="/"
        width="28"
        height="28"
        name="logo_main"
        extension="png"
      />
      <NavigationContainer>
        <NavItem to="/board">맛집보기</NavItem>

        {getUserProfileDataSuccess ? (
          userProfile?.profile_image ? (
            <DropdownMenu
              trigger={
                <Avatar size="36" src={userProfile.profile_image} hoverable />
              }
            >
              {menuItems.map((menuItem, idx) => (
                <MenuItem key={idx}>{menuItem.component}</MenuItem>
              ))}
            </DropdownMenu>
          ) : (
            <NavItem to="/Login" state={{ prevPath: location.pathname }}>
              로그인
            </NavItem>
          )
        ) : (
          <></>
        )}

        <Button as={Link} to="/posting">
          맛집추천하기
        </Button>
      </NavigationContainer>
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
  margin: 1rem auto 0 auto;
`;

const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 1.875rem;
`;

const NavItem = styled(Link)`
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
