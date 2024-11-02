"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Classes, Person } from "../types/api/castelinho";
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
}

interface TeacherContextType {
  state: TeacherState;
  setTeacherClasses: () => void;
  setSelectedClass: (classId: number) => Promise<void>;
}

// Criando o contexto
const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const {
    state: { accessToken, person },
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

  const setSelectedClass = async (classId: number) => {
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
  };

  return (
    <TeacherContext.Provider
      value={{ state, setTeacherClasses, setSelectedClass }}
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
