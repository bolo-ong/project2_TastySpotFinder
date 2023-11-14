import Axios from "axios";

const serverURL: string | undefined = process.env.REACT_APP_SERVER_URL;

const axios = Axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;
