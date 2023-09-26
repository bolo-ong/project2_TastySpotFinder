import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../apis/userAPI";

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
