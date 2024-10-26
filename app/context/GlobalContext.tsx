"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Gender, Role } from "../types/api/castelinho";
import { usePathname, useRouter } from "next/navigation";
import ROUTES from "../routes";
import { CASTELINHO_API } from "../api/castelinho";
import verifyRoute from "../utils/verifyRoute";
import { SkeletonText } from "@/components/ui/skeleton";
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
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<GlobalState>({
    person: null,
    accessToken: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const login = (data: GlobalState) => {
    setState({ ...state, person: data.person, accessToken: data.accessToken });
  };

  const logout = () => {
    setState({ ...state, person: null, accessToken: null });
    localStorage.removeItem("accessToken");
    router.push(ROUTES.login);
  };

  useEffect(() => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const routeType = verifyRoute(pathname);

    if (routeType === "private" || routeType === "unknown") {
      if (!accessToken) {
        setIsLoading(false);
        return router.push(ROUTES.login);
      }
      CASTELINHO_API.auth
        .validateToken(accessToken)
        .then((result) => {
          if (result) {
            setState((oldState) => ({ ...oldState, person: result.data }));
            if (routeType === "unknown") router.push(ROUTES.dashboard);
          } else localStorage.removeItem("accessToken");
          setIsLoading(false);
        })
        .catch(() => router.push(ROUTES.login));
    }
    setIsLoading(false);
  }, []);

  return (
    <GlobalContext.Provider value={{ state, login, logout }}>
      {isLoading ? <SkeletonText noOfLines={6} /> : children}
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
