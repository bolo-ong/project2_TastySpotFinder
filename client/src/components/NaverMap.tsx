import React from "react";
import { useNaverMap } from "../hooks/useNaverMap";

export const NaverMap = () => {
  useNaverMap();

  return (
    <>
      <div id="map" style={{ width: "500px", height: "500px" }} />
    </>
  );
};
