import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUserData = async () => {
  return await axios.get("http://localhost:8080/api/auth/user", {
    withCredentials: true,
  });
};

export const useGetUserDataQuery = () => {
  const {
    error: getUserDataError,
    data: userData,
    isSuccess: getUserDataSuccess,
  } = useQuery([`userData`], () => getUserData(), {
    select: (res) => res.data,
  });

  return {
    getUserDataError,
    userData,
    getUserDataSuccess,
  };
};
