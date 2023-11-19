import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useGetUserProfileDataQuery } from "queries";
export const PrivateRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useGetUserProfileDataQuery();

  useEffect(() => {
    userProfile === "Login required" &&
      navigate("/login", {
        state: { prevPath: location.pathname },
        replace: true,
      });
  }, [userProfile]);

  return userProfile?.displayName ? <Outlet /> : null;
};
