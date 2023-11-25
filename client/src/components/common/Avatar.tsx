import styled from "@emotion/styled";
import { ReactComponent as DefaultProfile } from "assets/images/icon_default_profile.svg";

export interface Props {
  size?: string | number;
  src?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Avatar = ({ size, hoverable, onClick, src, ...rest }: Props) => {
  return (
    <AvatarWrapper
      size={size}
      hoverable={hoverable}
      onClick={onClick}
      {...rest}
    >
      {src ? (
        <StyledAvatar src={src} />
      ) : (
        <DefaultProfile width="1.875rem" height="1.875rem" />
      )}
    </AvatarWrapper>
  );
};

const AvatarWrapper = styled.div<Props>`
  position: relative;

  width: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : "100%"};
  height: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : "100%"};
  ${({ hoverable }) =>
    hoverable &&
    `
    &:hover::after {
      content: "";
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: #220c0c;
      opacity: 0.2;
    }
    `}
`;

const StyledAvatar = styled.img<Props>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
