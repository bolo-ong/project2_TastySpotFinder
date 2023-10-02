import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Text } from "./common/Text";
import { theme } from "../styles/theme";

export const Navgation = () => {
  return (
    <Container>
      <Nav>
        <Link to="/board">
          <Text
            size="18px"
            weight="600"
            color={theme.colors.main}
            hoverable={true}
          >
            menu1
          </Text>
        </Link>
      </Nav>
      <LoginContainer>
        <LoginText>Login</LoginText>
      </LoginContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 40px;
`;

const NavItem = styled.a`
  font-weight: 600;
  &:hover {
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 40px;
`;

const LoginText = styled.div`
  font-weight: 600;
`;
