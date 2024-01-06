import axios from "axios";

export const ServiceClient = (url?: string) => {
  const axiosIntance = axios.create({
    baseURL: process.env.ADMIN_USER_URL,
  });

  return axiosIntance;
};
