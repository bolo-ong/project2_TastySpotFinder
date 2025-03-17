import axios from "apis";

/**
 * 유저 프로필 데이터를 받는 API
 * 비로그인 시 @returns {string} "Login required"
 */
export const getUserProfile = async () => {
  try {
    const res = await axios.get(`/api/auth/user/profile`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const userLogOut = async (provider: string) => {
  try {
    if (provider === "kakao") {
      const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.REACT_APP_KAKAO_LOGOUT_REDIRECT_URI}`;
      window.location.href = `${KAKAO_LOGOUT_URL}`;
    } else {
      const res = await axios.get(`/api/auth/logout/${provider}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        window.location.href = `/`;
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
