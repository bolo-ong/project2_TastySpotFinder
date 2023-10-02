import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Wrapper>
      <Link to="/">
        <LogoText>Logo</LogoText>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 40px;
`;

const LogoText = styled.div`
  font-weight: 600;
`;
