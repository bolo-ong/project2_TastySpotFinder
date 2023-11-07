import { useQuery } from "@tanstack/react-query";
import { getUserData } from "apis/authAPI";

export const useGetUserDataQuery = () => {
  const {
    error: getUserDataError,
    data: userData,
    isSuccess: getUserDataSuccess,
    isLoading: getUserDataLoading,
  } = useQuery(["userData"], () => getUserData(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    getUserDataError,
    userData,
    getUserDataSuccess,
    getUserDataLoading,
  };
};
