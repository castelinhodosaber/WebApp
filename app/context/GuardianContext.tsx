"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  Classes,
  Person,
  StudentGuardianRelationship,
} from "../types/api/castelinho";
import { useGlobalContext } from "./GlobalContext";
import { CASTELINHO_API_ENDPOINTS } from "../api/castelinho";

// import apiLogin from "../api/castelinho/auth/login";

// Definindo o tipo para o estado global
type GuardianState = Person & {
  students: (Person & {
    classes: Classes[];
    relationship: StudentGuardianRelationship;
  })[];
};
interface GuardianContextType {
  state?: GuardianState;
}

// Criando o contexto
const GuardianContext = createContext<GuardianContextType | undefined>(
  undefined
);

export const GuardianProvider = ({ children }: { children: ReactNode }) => {
  const {
    state: { accessToken, person },
  } = useGlobalContext();
  const [state, setState] = useState<GuardianState>();

  const setGuardianDetails = () => {
    if (accessToken && person) {
      CASTELINHO_API_ENDPOINTS.guardian
        .getDetailsById(accessToken, person?.roleId)
        .then((result) => {
          if (typeof result?.data !== "undefined") {
            setState((oldState) => ({
              ...oldState,
              ...result.data,
            }));
          }
        });
    }
  };

  useEffect(() => {
    setGuardianDetails();
  }, []);

  return (
    <GuardianContext.Provider value={{ state }}>
      {children}
    </GuardianContext.Provider>
  );
};

// Custom hook para usar o GuardianContext
export const useGuardianContext = () => {
  const context = useContext(GuardianContext);
  if (!context) {
    throw new Error(
      "useGuardianContext must be used within a GuardianProvider"
    );
  }
  return context;
};
