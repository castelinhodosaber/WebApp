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
import { Button } from "@chakra-ui/react";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

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
  const [showNotificationBtn, setShowNotificationBtn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<GlobalState>({
    person: null,
    accessToken: null,
    date: { br: "", iso: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newDate, _setNewDate] = useState(new Date());
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

              case "guardian":
                return setRedirectPath(ROUTES.private.guardian.home);
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
      typeof Notification !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches &&
      Notification.permission !== "granted" &&
      state.accessToken
    ) {
      setShowNotificationBtn(true);
    }
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

  const requestPermission = async () => {
    fetch("/api/firebaseConfig")
      .then((res) => res.json())
      .then(async (config) => {
        const app = initializeApp(config);
        const messaging = getMessaging(app);
        if (
          (!window.matchMedia("(display-mode: standalone)").matches ||
            typeof Notification === "undefined") &&
          !state.accessToken
        )
          return;
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY || "",
            });

            CASTELINHO_API_ENDPOINTS.notification.createOrUpdateFCMToken(
              state.accessToken || "",
              token
            );
          } else {
            console.error("Permission not granted for notifications");
          }
        } catch (error) {
          console.error("Error getting permission for notifications:" + error);
        }
      })
      .catch((err) => console.error(err));
  };

  // Chame esta função em um botão ou automaticamente, dependendo da lógica do seu app

  return (
    <GlobalContext.Provider value={{ state, login, logout }}>
      {isLoading ? <Loading /> : children}
      <Button
        style={{
          display: showNotificationBtn ? "block" : "none",
          position: "absolute",
          zIndex: 1000,
          top: 0,
        }}
        onClick={requestPermission}
      >
        Receber notificacoes
      </Button>
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
