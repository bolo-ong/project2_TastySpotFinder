import styled from "@emotion/styled";
import { SocialLogInButton } from "components/";

export const LogIn = () => {
  return (
    <Container>
      <SocialLogInButtonContainer>
        <SocialLogInButton provider="naver">네이버 로그인</SocialLogInButton>
        <SocialLogInButton provider="kakao">카카오 로그인</SocialLogInButton>
        <SocialLogInButton provider="google">구글 로그인</SocialLogInButton>
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
