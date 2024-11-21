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
import { CASTELINHO_API_ENDPOINTS } from "../api/castelinho";
import verifyRoute from "../utils/verifyRoute";
import { SkeletonCircle } from "@/components/ui/skeleton";
// import apiLogin from "../api/castelinho/auth/login";

// Definindo o tipo para o estado global
interface AuthData {
  accessToken: string | null;
  person: {
    birthDate: string;
    cpf: string;
    gender: Gender;
    id: number;
    name: string;
    role: Role;
    roleId: number;
  } | null;
}

type GlobalState = AuthData & {
  date: string;
};

// Definindo o tipo para as funções do contexto
interface GlobalContextType {
  state: GlobalState;
  login: (data: AuthData) => void;
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
    date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string>();

  const login = (data: AuthData) => {
    setState({ ...state, person: data.person, accessToken: data.accessToken });
  };

  const logout = () => {
    setState({ ...state, person: null, accessToken: null });
    localStorage.removeItem("accessToken");
    router.push(ROUTES.public.login);
  };

  useEffect(() => {
    const validateAndRedirect = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const routeType = verifyRoute(pathname);

      if (!accessToken) {
        setRedirectPath(ROUTES.public.login);
        return;
      }

      try {
        const result = await CASTELINHO_API_ENDPOINTS.auth.validateToken(
          accessToken
        );
        if (result) {
          const {
            data: { birthDate, cpf, gender, name, personId: id, roleId, role },
          } = result;
          setState((oldState) => ({
            ...oldState,
            person: { birthDate, cpf, gender, name, id, roleId, role },
            accessToken: accessToken,
          }));

          if (routeType === "unknown" || ROUTES.public.login === pathname) {
            switch (role) {
              case "teacher":
                return setRedirectPath(ROUTES.private.teacher.dashboard);

              default:
                break;
            }
            setRedirectPath(ROUTES.public.login);
          } else setRedirectPath(pathname);
        } else {
          localStorage.removeItem("accessToken");
          setRedirectPath(ROUTES.public.login);
        }
      } catch {
        setRedirectPath(ROUTES.public.login);
      }
    };

    validateAndRedirect();
    const newDate = new Date()
      .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      .split(",")[0];
    setState((oldState) => ({ ...oldState, date: newDate }));
  }, []);

  useEffect(() => {
    if (redirectPath) {
      if (redirectPath !== pathname) router.push(redirectPath);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [redirectPath]);

  return (
    <GlobalContext.Provider value={{ state, login, logout }}>
      {isLoading ? <SkeletonCircle /> : children}
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
