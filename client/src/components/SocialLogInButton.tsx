import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Image } from ".";

export const SocialLogInButton = ({ children, platform }: Props) => {
  return (
    <Link to={`${process.env.REACT_APP_SERVER_URL}/api/auth/${platform}`}>
      <StyledSocialLogInButton platform={platform}>
        <ImageWrapper>
          <Image name={`logo_${platform}`} extension="svg" />
        </ImageWrapper>
        {children}
      </StyledSocialLogInButton>
    </Link>
  );
};

interface Props {
  platform: "kakao" | "google" | "naver";
  children: React.ReactNode;
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
  &:hover {
    filter: brightness(0.9);
  }
  ${({ platform }) => {
    switch (platform) {
      case "kakao":
        return `
            background-color: #ffdf00;
            color: #3B1D1B;
          `;
      case "naver":
        return `
            background-color: #00BC3D;
            color: #E1F7E8;
          `;
      case "google":
        return `
            background-color: #ffffff;
            border: 0.0625rem solid #D3D3D3;
          `;
    }
  }};
`;

const ImageWrapper = styled.div`
  position: absolute;
  left: 1.125rem;
`;
