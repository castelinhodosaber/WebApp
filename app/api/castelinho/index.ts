import axios from "axios";
import login from "./auth/login";
import validateToken from "./auth/validateToken";
import getDetailsById from "./teacher/getDetailsById";
import getAll from "./class/getAll";
import getById from "./class/getById";
import getAttendanceByClassIdAndDate from "./attendance/getByClassIdAndDate";
import createManyAttendance from "./attendance/createMany";
import getMealByClassIdAndDate from "./meal/getByClassIdAndDate";
import createManyMeals from "./meal/createMany";
import getMealTypeByClassId from "./mealType/getByClassId";
import createManyNaps from "./nap/createMany";
import getNapsByClassIdAndDate from "./nap/getByClassIdAndDate";
import deleteNapById from "./nap/deleteById";
import createOneNap from "./nap/createOne";

export type CastelinhoApiResponseData = {
  message: string;
  status: number;
};

export const CASTELINHO_API_ENDPOINTS = {
  attendance: {
    getByClassIdAndDate: getAttendanceByClassIdAndDate,
    createMany: createManyAttendance,
  },
  auth: {
    login,
    validateToken,
  },
  class: {
    getAll,
    getById,
  },
  meal: {
    getByClassIdAndDate: getMealByClassIdAndDate,
    createMany: createManyMeals,
  },
  mealType: {
    getByClassId: getMealTypeByClassId,
  },
  nap: {
    createMany: createManyNaps,
    getByClassIdAndDate: getNapsByClassIdAndDate,
    deleteById: deleteNapById,
    createOne: createOneNap,
  },
  teacher: {
    getDetailsById,
  },
};

const castelinhoApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CASTELINHO_API || "//localhost:3001",
  timeout: 5000,
  headers: {
    "ngrok-skip-browser-warning": true,
  },
});

export default castelinhoApiInstance;
