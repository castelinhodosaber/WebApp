import axios, { AxiosResponse } from "axios";
import login from "./auth/login";
import validateToken from "./auth/validateToken";

export type CastelinhoApiResponseData = AxiosResponse & {
  response: {
    data: {
      message: string;
      status: number;
    };
  };
};

export const CASTELINHO_API = {
  auth: {
    login,
    validateToken,
  },
};

const castelinhoApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CASTELINHO_API || "//localhost:3001",
  timeout: 5000,
});

export default castelinhoApiInstance;
