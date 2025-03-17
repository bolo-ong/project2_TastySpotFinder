import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "apis/authAPI";

/**
 * 비로그인 시 @returns {string} "Login required"
 */
export const useGetUserProfileDataQuery = () => {
  const {
    error: getUserProfileDataError,
    data: userProfile,
    isSuccess: getUserProfileDataSuccess,
    isLoading: getUserProfileDataLoading,
  } = useQuery(["userProfile"], getUserProfile, {
    retry: 2, // 실패시 2번 재시도
    retryDelay: 1000, // 재시도 간격 1초
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    cacheTime: 1000 * 60 * 60 * 6, // 6시간 캐시 보관
    refetchOnMount: false, // 컴포넌트 마운트시 재요청
    refetchOnWindowFocus: false, // 윈도우 포커스시 재요청 안함
  });

  return {
    getUserProfileDataError,
    userProfile,
    getUserProfileDataSuccess,
    getUserProfileDataLoading,
  };
};
