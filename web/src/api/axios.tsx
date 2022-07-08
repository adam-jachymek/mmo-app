import axios from "axios";
import getToken from "./getToken";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API}`,
});

api.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) config!.headers!.Authorization = `Bearer ${token}`;
    config!.headers!.char = 1;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
