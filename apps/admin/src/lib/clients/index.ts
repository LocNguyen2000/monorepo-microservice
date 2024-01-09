import axios from "axios";

export const ServiceClient = (url?: string) => {
  const axiosIntance = axios.create({
    baseURL: process.env.ADMIN_ENDPOINTS_SERVICE,
  });

  return axiosIntance;
};
