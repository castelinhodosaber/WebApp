"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Attendance, Classes, Person } from "../types/api/castelinho";
import { useGlobalContext } from "./GlobalContext";
import { CASTELINHO_API_ENDPOINTS } from "../api/castelinho";

// import apiLogin from "../api/castelinho/auth/login";

// Definindo o tipo para o estado global
interface TeacherState {
  teacherClasses?: (Classes & {
    students: Person[];
  })[];
  classes?: Classes[];
  selectedClass?: Classes & { students: Person[] };
  attendance?: Attendance[];
}

interface TeacherContextType {
  state: TeacherState;
  setTeacherClasses: () => void;
  setSelectedClass: (classId?: number) => Promise<void>;
  setAttendance: (attendance: Attendance[]) => void;
}

// Criando o contexto
const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const {
    state: { accessToken, person, date },
  } = useGlobalContext();
  const [state, setState] = useState<TeacherState>({});

  const setTeacherClasses = () => {
    if (accessToken && person) {
      CASTELINHO_API_ENDPOINTS.teacher
        .getDetailsById(accessToken, person?.roleId)
        .then((result) => {
          if (result) {
            setState((oldState) => ({
              ...oldState,
              teacherClasses: result?.data.classes,
            }));
          }
        });
    }
  };

  const setClasses = () => {
    if (accessToken && person) {
      CASTELINHO_API_ENDPOINTS.class.getAll(accessToken).then((result) => {
        if (result) {
          setState((oldState) => ({
            ...oldState,
            classes: result?.data,
          }));
        }
      });
    }
  };

  useEffect(() => {
    setTeacherClasses();
    setClasses();
  }, []);

  const setSelectedClass = async (classId?: number) => {
    if (classId) {
      const isTeacherClass = state.teacherClasses?.find(
        (aClass) => aClass.id === classId
      );
      if (isTeacherClass) {
        setState({ ...state, selectedClass: isTeacherClass });
      } else if (accessToken) {
        const response = await CASTELINHO_API_ENDPOINTS.class.getById(
          accessToken,
          classId
        );
        if (response) setState({ ...state, selectedClass: response.data });
      }
    } else {
      setState({ ...state, selectedClass: undefined });
    }
  };

  const setAttendance = (attendance: Attendance[]) =>
    setState({ ...state, attendance });

  useEffect(() => {
    if (!state.attendance && state.selectedClass && date && accessToken) {
      CASTELINHO_API_ENDPOINTS.attendance
        .getByClassIdAndDate(accessToken, state.selectedClass.id, date.iso)
        .then(
          (attendanceRes) =>
            attendanceRes &&
            setState({ ...state, attendance: attendanceRes.data })
        );
    }
  }, [state, date, accessToken]);

  return (
    <TeacherContext.Provider
      value={{ state, setTeacherClasses, setSelectedClass, setAttendance }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

// Custom hook para usar o TeacherContext
export const useTeacherContext = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacherContext must be used within a TeacherProvider");
  }
  return context;
};
