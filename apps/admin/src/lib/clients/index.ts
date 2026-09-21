import axios from "axios";

export const ServiceClient = (url?: string) => {
  const axiosIntance = axios.create({
    baseURL: url || process.env.ADMIN_ENDPOINTS_SERVICE,
  });

  axiosIntance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return axiosIntance;
};
