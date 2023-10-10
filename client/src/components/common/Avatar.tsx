import styled from "@emotion/styled";

export const Avatar = ({ size, src, hoverable }: Props) => {
  return (
    <AvatarWrapper size={size} hoverable>
      <StyledAvatar src={src} alt="profile_img" />
    </AvatarWrapper>
  );
};

interface Props {
  size?: string | number;
  src?: string;
  hoverable?: boolean;
}

const AvatarWrapper = styled.div<Props>`
  position: relative;

  width: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : "100%"};
  height: ${({ size, theme }) =>
    size ? theme.pxToRem(parseInt(`${size}`)) : "100%"};
  ${({ hoverable }) =>
    hoverable &&
    `
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: #220c0c;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
    &:hover::after {
      opacity: 0.2;
    }
    `}
`;

const StyledAvatar = styled.img<Props>`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  object-fit: cover;
`;
