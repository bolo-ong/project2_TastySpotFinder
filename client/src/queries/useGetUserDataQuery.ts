import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUserData = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/auth/user", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

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
