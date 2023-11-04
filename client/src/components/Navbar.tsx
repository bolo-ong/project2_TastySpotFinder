import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { Link } from "react-router-dom";
import { userLogOut } from "apis/authAPI";
import { useGetUserDataQuery } from "queries/useGetUserDataQuery";
import { Image, Avatar, Button, DropdownMenu, MenuItem } from ".";

export const Navbar = () => {
  const { userData } = useGetUserDataQuery();
  console.log(userData);

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
        {userData === "Login information not found." && (
          <NavItem to="/Login">로그인</NavItem>
        )}
        {userData?.profile_image && (
          <>
            <DropdownMenu
              trigger={
                <Avatar size="36" src={userData.profile_image} hoverable />
              }
            >
              <MenuItem>
                <Link to="/">저장한 리스트</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/board">저장한 맛집</Link>
              </MenuItem>
              <MenuItem>
                <Link to="#">나의 맛집</Link>
              </MenuItem>
              <MenuItem>
                <button onClick={() => userLogOut(userData.provider)}>
                  로그아웃
                </button>
              </MenuItem>
            </DropdownMenu>

            <Button as={Link} to="/posting">
              맛집추천하기
            </Button>
          </>
        )}
      </NavigationContainer>
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  z-index: 10;

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
