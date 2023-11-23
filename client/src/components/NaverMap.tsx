import styled from "@emotion/styled";
import { useNaverMap } from "../hooks/useNaverMap";

export const NaverMap = () => {
  useNaverMap();

  return <Map />;
};

const Map = styled.div`
  width: 500px;
  height: 500px;
`;
