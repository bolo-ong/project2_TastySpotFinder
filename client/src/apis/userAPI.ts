import axios from "axios";

const serverUrl: string | undefined = process.env.REACT_APP_SERVER_URL;

export const getUserData = async () => {
  try {
    const res = await axios.get(`${serverUrl}/api/auth/user`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
