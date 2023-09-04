import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getLoginData = async (platform: string) => {
  return await axios.get(`http://localhost:8080/api/auth/${platform}`);
};

export const useSocialLoginQuery = (platform: string) => {
  console.log(platform);
  const {
    isLoading: isSocialLogInLoading,
    error: socialLogInError,
    data: socialLogInData,
    isSuccess: isSocialLogInSuccess,
  } = useQuery([`${platform}Login`], () => getLoginData(platform), {
    enabled: !!platform,
  });

  return {
    isSocialLogInLoading,
    socialLogInError,
    socialLogInData,
    isSocialLogInSuccess,
  };
};
