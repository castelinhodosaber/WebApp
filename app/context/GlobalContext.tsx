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
import { formatInTimeZone } from "date-fns-tz";
import Loading from "../components/Loading";

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
  date: {
    br: string;
    iso: string;
  };
};

interface GlobalContextType {
  state: GlobalState;
  login: (data: AuthData) => void;
  logout: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<GlobalState>({
    person: null,
    accessToken: null,
    date: { br: "", iso: "" },
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
    const newDate = new Date();

    setState((oldState) => ({
      ...oldState,
      date: {
        br: newDate
          .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
          .split(",")[0],
        iso: formatInTimeZone(newDate, "America/Sao_Paulo", "yyyy-MM-dd"),
      },
    }));
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
      {isLoading ? <Loading /> : children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
