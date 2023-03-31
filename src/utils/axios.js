import axios from "axios";

const baseURL = "http://localhost:5000";

const instance = axios.create({
  baseURL,
});
instance.interceptors.request.use(
  function (config) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("user") || "{}").access_token,
      },
    };
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;
