import axios from "axios";
import login from "./auth/login";
import validateToken from "./auth/validateToken";
import getTeacherDetailsById from "./teacher/getDetailsById";
import getGuardianDetailsById from "./guardian/getDetailsById";
import getAllClass from "./class/getAll";
import getClassById from "./class/getById";
import getAttendanceByClassIdAndDate from "./attendance/getByClassIdAndDate";
import createManyAttendance from "./attendance/createMany";
import getMealByClassIdAndDate from "./meal/getByClassIdAndDate";
import createManyMeals from "./meal/createMany";
import getMealTypeByClassId from "./mealType/getByClassId";
import createManyNaps from "./nap/createMany";
import getNapsByClassIdAndDate from "./nap/getByClassIdAndDate";
import deleteNapById from "./nap/deleteById";
import createOneNap from "./nap/createOne";
import getBathsByClassIdAndDate from "./bath/getByClassIdAndDate";
import createOneBath from "./bath/createOne";
import createManyBath from "./bath/createMany";
import getBathroomsByClassIdAndDate from "./bathroom/getByClassIdAndDate";
import createOneBathroom from "./bathroom/createOne";
import createManyBathroom from "./bathroom/createMany";
import updateCommentById from "./attendance/updateCommentById";
import getByClassId from "./guardianAnnotation/getByClassId";
import getAllAnnouncement from "./announcement/getAll";
import getStudentDetailsByIdAndDate from "./student/getDetailsByIdAndDate";

export type CastelinhoApiResponseData = {
  message: string;
  status: number;
};

export const CASTELINHO_API_ENDPOINTS = {
  announcement: {
    getAllAnnouncement,
  },
  attendance: {
    getByClassIdAndDate: getAttendanceByClassIdAndDate,
    createMany: createManyAttendance,
    updateCommentById,
  },
  auth: {
    login,
    validateToken,
  },
  bath: {
    getByClassIdAndDate: getBathsByClassIdAndDate,
    createOne: createOneBath,
    createMany: createManyBath,
  },
  bathroom: {
    getByClassIdAndDate: getBathroomsByClassIdAndDate,
    createOne: createOneBathroom,
    createMany: createManyBathroom,
  },
  class: {
    getAllClass,
    getClassById,
  },
  guardian: {
    getDetailsById: getGuardianDetailsById,
  },
  guardianAnnotation: {
    getByClassId: getByClassId,
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
  student: {
    getDetailsByIdAndDate: getStudentDetailsByIdAndDate,
  },
  teacher: {
    getDetailsById: getTeacherDetailsById,
  },
};

const castelinhoApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CASTELINHO_API || "http://localhost:3001",
  timeout: 5000,
  headers: {
    "ngrok-skip-browser-warning": true,
  },
});

export default castelinhoApiInstance;
