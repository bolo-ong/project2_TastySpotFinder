import axios from "apis";

export const getUserData = async () => {
  try {
    const res = await axios.get(`/api/auth/user`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const userLogOut = async (provider: string) => {
  try {
    if (provider === "kakao") {
      const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.REACT_APP_KAKAO_LOGOUT_REDIRECT_URI}`;
      window.location.href = `${KAKAO_LOGOUT_URL}`;
    } else {
      const res = await axios.get(`/api/auth/logout/${provider}`);
      if (res.status === 200) {
        window.location.href = `/`;
      }
    }
  } catch (err) {
    console.error(err);
  }
};
