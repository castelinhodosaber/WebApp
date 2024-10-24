"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Gender, Role } from "../types/api/castelinho";
// import apiLogin from "../api/castelinho/auth/login";

// Definindo o tipo para o estado global
interface GlobalState {
  accessToken: string | null;
  person: {
    birthDate: string;
    cpf: string;
    gender: Gender;
    id: number;
    name: string;
    role: Role;
  } | null;
}

// Definindo o tipo para as funções do contexto
interface GlobalContextType {
  state: GlobalState;
  login: (data: GlobalState) => void;
  logout: () => void;
}

// Criando o contexto
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>({
    person: null,
    accessToken: null,
  });

  const login = (data: GlobalState) => {
    setState({ ...state, person: data.person, accessToken: data.accessToken });
  };

  const logout = () => {
    setState({ ...state, person: null, accessToken: null });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
  }, []);

  return (
    <GlobalContext.Provider value={{ state, login, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook para usar o GlobalContext
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
