import React, { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useGetLocationQuery } from "queries";

// 위치정보 동의를 하지 않은 상태에서, '가까운순' 목록을 보려하면, 메인페이지로 이동
export const LocationProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissionState, isPermissionChecked } = useGetLocationQuery();

  useEffect(() => {
    if (!isPermissionChecked) return;

    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter");

    if (location.pathname === "/board/restaurant" && filter === "가까운순") {
      if (permissionState !== "granted") {
        navigate("/", { replace: true });
      }
    }
  }, [permissionState, isPermissionChecked]);

  return <Outlet />;
};
