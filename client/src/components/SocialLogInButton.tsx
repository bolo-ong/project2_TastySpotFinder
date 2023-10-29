import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Image } from ".";
import { theme } from "styles/theme";

export const SocialLogInButton = ({ children, provider }: Props) => {
  return (
    <Link to={`${process.env.REACT_APP_SERVER_URL}/api/auth/${provider}`}>
      <StyledSocialLogInButton provider={provider}>
        <ImageWrapper>
          <Image name={`logo_${provider}`} extension="svg" />
        </ImageWrapper>
        {children}
      </StyledSocialLogInButton>
    </Link>
  );
};

interface Props {
  provider: "kakao" | "google" | "naver";
  children?: React.ReactNode;
}

const StyledSocialLogInButton = styled.button<Props>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  min-width: 18.75rem;
  height: 3.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.25rem;

  transition: filter 0.2s ease-in-out;

  color: ${({ provider }) => providers[provider].color};
  background-color: ${({ provider }) => providers[provider].backgroundColor};
  border: ${({ provider }) => providers[provider].border};

  &:hover {
    filter: brightness(0.9);
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  left: 1.125rem;
`;

interface PlatformProps {
  backgroundColor?: string;
  color?: string;
  border?: string;
}

const providers: Record<string, PlatformProps> = {
  kakao: {
    backgroundColor: "#ffdf00",
    color: "#3B1D1B",
  },
  naver: {
    backgroundColor: "#00BC3D",
    color: "#E1F7E8",
  },
  google: {
    backgroundColor: theme.colors.white,
    border: `0.0625rem solid ${theme.colors.gray[2]}`,
  },
};
