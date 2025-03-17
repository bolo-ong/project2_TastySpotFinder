import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { Image, Ripple } from "components";

export interface Props {
  provider: "kakao" | "google" | "naver";
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
}

export const SocialLogInButton = ({
  children,
  provider,
  onClick,
  disabled = false,
  ...rest
}: Props) => {
  return (
    <StyledLink
      href={`${process.env.REACT_APP_SERVER_URL}/api/auth/${provider}`}
      provider={provider}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      disabled={disabled}
      {...rest}
    >
      <ImageWrapper>
        <Image name={`logo_${provider}`} extension="svg" />
      </ImageWrapper>
      {children}
      <Ripple />
    </StyledLink>
  );
};

const StyledLink = styled.a<Props>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  min-width: 18.75rem;
  height: 3.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.25rem;
  text-decoration: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  transition: filter 0.2s ease-in-out;

  color: ${({ provider }) => providers[provider].color};
  background-color: ${({ provider }) => providers[provider].backgroundColor};
  border: ${({ provider }) => providers[provider].border};

  &:hover {
    filter: ${({ disabled }) => !disabled && "brightness(0.9)"};
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
