import axios, { AxiosResponse } from "axios";

export type CastelinhoApiResponseData = AxiosResponse & {
  response: {
    data: {
      message: string;
      status: number;
    };
  };
};

const castelinhoApiInstance = axios.create({
  baseURL: process.env.CASTELINHO_API || "//localhost:3001",
  timeout: 5000,
});

export default castelinhoApiInstance;
