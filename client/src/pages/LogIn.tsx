import styled from "@emotion/styled";
import { SocialLogInButton } from "components";
import { useLocation } from "react-router-dom";

export const LogIn = () => {
  const location = useLocation();
  const prevPath = location.state ? location.state.prevPath : "/";

  const handleClick = () => {
    localStorage.setItem("prevPath", prevPath);
  };

  return (
    <Container>
      <SocialLogInButtonContainer>
        <SocialLogInButton onClick={handleClick} provider="naver">
          네이버 로그인
        </SocialLogInButton>
        <SocialLogInButton onClick={handleClick} provider="kakao">
          카카오 로그인
        </SocialLogInButton>
        <SocialLogInButton onClick={handleClick} provider="google">
          구글 로그인
        </SocialLogInButton>
      </SocialLogInButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

const SocialLogInButtonContainer = styled.div`
  width: 18.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
