import axios from "axios";
import login from "./auth/login";
import validateToken from "./auth/validateToken";
import getDetailsById from "./teacher/getDetailsById";
import getAll from "./class/getAll";
import getById from "./class/getById";

export type CastelinhoApiResponseData = {
  response: {
    data: {
      message: string;
      status: number;
    };
  };
};

export const CASTELINHO_API_ENDPOINTS = {
  auth: {
    login,
    validateToken,
  },
  teacher: {
    getDetailsById,
  },
  class: {
    getAll,
    getById,
  },
};

const castelinhoApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CASTELINHO_API || "//localhost:3001",
  timeout: 5000,
});

export default castelinhoApiInstance;
