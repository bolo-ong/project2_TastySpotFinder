import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "apis/authAPI";

/**
 * 로그인 시 @returns {Promise<{ displayName: string, profile_image: string, provider: string }>}
 * 비로그인 시 @returns {string} "Login required"
 */

export const useGetUserProfileDataQuery = () => {
  const {
    error: getUserProfileDataError,
    data: userProfile,
    isSuccess: getUserProfileDataSuccess,
    isLoading: getUserProfileDataLoading,
  } = useQuery(["userProfile"], getUserProfile);
  return {
    getUserProfileDataError,
    userProfile,
    getUserProfileDataSuccess,
    getUserProfileDataLoading,
  };
};
