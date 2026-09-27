import axios from "axios";

export const ServiceClient = (url?: string) => {
  const axiosIntance = axios.create({
    baseURL: url || process.env.ADMIN_ENDPOINTS_SERVICE,
  });
  let isLoggingOut = false;

  axiosIntance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  axiosIntance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;

        const sessionId = localStorage.getItem("sessionId");

        axiosIntance
          .post("auth/logout", { sessionId })
          .catch(() => undefined)
          .finally(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("authUser");
            localStorage.removeItem("sessionId");
            isLoggingOut = false;
            window.location.href = "/login";
          });
      }
      return Promise.reject(error);
    },
  );

  return axiosIntance;
};
