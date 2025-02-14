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
import requestNotificationsPermission from "../utils/requestNotificationsPermission";
import { Button } from "@chakra-ui/react";

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
    FCMToken: string;
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
  const [newDate, _setNewDate] = useState(new Date());
  const [showNotificationButton, setShowNotificationButton] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>();

  const login = (data: AuthData) => {
    setState({ ...state, person: data.person, accessToken: data.accessToken });
  };

  const logout = () => {
    setIsLoading(true);
    setState({ ...state, person: null, accessToken: null });
    localStorage.removeItem("accessToken");
    router.push(ROUTES.public.login);
    setIsLoading(false);
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
            data: {
              birthDate,
              cpf,
              gender,
              name,
              personId: id,
              roleId,
              role,
              FCMToken,
            },
          } = result;
          setState((oldState) => ({
            ...oldState,
            person: {
              birthDate,
              cpf,
              gender,
              name,
              id,
              roleId,
              role,
              FCMToken,
            },
            accessToken: accessToken,
          }));

          if (routeType === "unknown" || ROUTES.public.login === pathname) {
            switch (role) {
              case "teacher":
                return setRedirectPath(ROUTES.private.teacher.dashboard);

              case "guardian":
                return setRedirectPath(ROUTES.private.guardian.home);

              case "principal":
                return setRedirectPath(ROUTES.private.principal.dashboard);
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

    setState((oldState) => ({
      ...oldState,
      date: {
        br: newDate
          .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
          .split(",")[0],
        iso: formatInTimeZone(newDate, "America/Sao_Paulo", "yyyy-MM-dd"),
      },
    }));

    if (
      "serviceWorker" in navigator &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        if (!registration.active) {
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
              console.log(
                "Service Worker registered successfully:" + registration
              );
            })
            .catch((err) => {
              console.error("Service Worker registration failed:" + err);
            });
        }
      });
    }
  }, [newDate]);

  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches &&
      state.accessToken &&
      (state.person?.FCMToken !== localStorage.getItem("FCMToken") ||
        !state.person?.FCMToken ||
        Notification.permission !== "granted")
    ) {
      setShowNotificationButton(true);
    }
  }, [state]);

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
      {showNotificationButton ? (
        <Button
          position="absolute"
          id="request-notification-button"
          top="5px"
          left="5px"
          zIndex={1000}
          onClick={() =>
            requestNotificationsPermission(state.accessToken || "")
          }
        >
          Exibir Notificações
        </Button>
      ) : null}
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
