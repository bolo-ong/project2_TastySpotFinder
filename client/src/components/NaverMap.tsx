import styled from "@emotion/styled";
import { useNaverMap } from "../hooks/useNaverMap";
import { Restaurant } from "types";
import { theme } from "styles/theme";

interface Props {
  data: Restaurant | Restaurant[];
  width?: string | number;
  height?: string | number;
}

export const NaverMap = ({ data, width, height }: Props) => {
  const containerId = "map";
  useNaverMap({ containerId, data });

  return <Map id={containerId} width={width} height={height} />;
};

const Map = styled.div<Pick<Props, "width" | "height">>`
  width: ${({ width }) => (width ? theme.pxToRem(`${width}`) : "100%")};
  height: ${({ height }) => (height ? theme.pxToRem(`${height}`) : "100vh")};
`;
