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

interface PrincipalState {
  classes?: Classes[];
  selectedClass?: Classes & { students: Person[] };
  attendance?: Attendance[];
}

interface PrincipalContextType {
  state: PrincipalState;
  setSelectedClass: (classId?: number) => Promise<void>;
  setAttendance: (attendance: Attendance[]) => void;
}

// Criando o contexto
const PrincipalContext = createContext<PrincipalContextType | undefined>(
  undefined
);

export const PrincipalProvider = ({ children }: { children: ReactNode }) => {
  const {
    state: { accessToken, person, date },
  } = useGlobalContext();
  const [state, setState] = useState<PrincipalState>({});

  const setClasses = () => {
    if (accessToken && person) {
      CASTELINHO_API_ENDPOINTS.class.getAllClass(accessToken).then((result) => {
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
    setClasses();
  }, []);

  const setSelectedClass = async (classId?: number) => {
    if (accessToken && classId) {
      const response = await CASTELINHO_API_ENDPOINTS.class.getClassById(
        accessToken,
        classId
      );
      if (response)
        setState({
          ...state,
          selectedClass: response.data,
          attendance: undefined,
        });
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
    <PrincipalContext.Provider
      value={{ state, setSelectedClass, setAttendance }}
    >
      {children}
    </PrincipalContext.Provider>
  );
};

// Custom hook para usar o PrincipalContext
export const usePrincipalContext = () => {
  const context = useContext(PrincipalContext);
  if (!context) {
    throw new Error(
      "usePrincipalContext must be used within a PrincipalProvider"
    );
  }
  return context;
};
