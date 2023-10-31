import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Link, NavLink } from "react-router-dom";
import { theme } from "styles/theme";
import { Avatar, Button, DropdownMenu } from ".";
import { useGetUserDataQuery } from "queries/useGetUserDataQuery";
import { userLogOut } from "apis/authAPI";

export const Navgation = () => {
  const { userData } = useGetUserDataQuery();
  console.log(userData);

  return (
    <Container>
      <StyledLink to="/board">맛집보기</StyledLink>
      {userData === "Login information not found." && (
        <StyledLink to="/Login">로그인</StyledLink>
      )}
      {userData?.profile_image && (
        <>
          <DropdownMenu
            DropdownButton={
              <Avatar size="36" src={userData.profile_image} hoverable />
            }
          >
            <NavLink to="/">저장한 리스트</NavLink>
            <NavLink to="/board">저장한 맛집</NavLink>
            <NavLink to="#">나의 맛집</NavLink>
            <button onClick={() => userLogOut(userData.provider)}>
              로그아웃
            </button>
          </DropdownMenu>

          <Button as={Link} to="/posting">
            맛집추천하기
          </Button>
        </>
      )}
    </Container>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.875rem;
`;

const NavItemStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.black};
  padding: 0 0.5rem;
  &:hover {
    color: ${theme.colors.main[5]};
  }
`;
const StyledLink = styled(Link)`
  ${NavItemStyle}
`;
