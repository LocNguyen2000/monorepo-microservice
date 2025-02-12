import axios from "axios";

export const AccountClient = () => {
  const axiosIntance = axios.create({
    baseURL: process.env.ADMIN_ENDPOINTS_ACCOUNT,
  });

  return axiosIntance;
};
