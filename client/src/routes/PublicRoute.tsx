import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useGetUserProfileDataQuery } from "queries";
export const PublicRoute = () => {
  const navigate = useNavigate();
  const { userProfile } = useGetUserProfileDataQuery();

  useEffect(() => {
    userProfile?.displayName &&
      navigate("/", {
        replace: true,
      });
  }, []);

  return userProfile === "Login required" ? <Outlet /> : null;
};
