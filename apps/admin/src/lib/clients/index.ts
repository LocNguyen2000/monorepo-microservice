import axios from "axios";

export const UserClient = (url: string) => {
  const axiosIntance = axios.create({
    baseURL: url,
  });

  return axiosIntance;
};
