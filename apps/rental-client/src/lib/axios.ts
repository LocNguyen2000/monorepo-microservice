import axios from "axios";

declare const process: {
  env: {
    ADMIN_ENDPOINTS_SERVICE?: string;
  };
};

export const ServiceClient = () => {
  const axiosIntance = axios.create({
    baseURL: process.env.ADMIN_ENDPOINTS_SERVICE,
  });

  return axiosIntance;
}