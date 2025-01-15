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
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Configuração do Firebase (substitua pelos dados do seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyBbRyZgxWHV8W2s5Wt9tRI7LqeJF0Jivcs",
  authDomain: "castelinho-notifications.firebaseapp.com",
  projectId: "castelinho-notifications",
  storageBucket: "castelinho-notifications.firebasestorage.app",
  messagingSenderId: "852490723230",
  appId: "1:852490723230:web:d210247b1cd90ae506c08f",
  measurementId: "G-XT7ZEHMXHY",
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

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
    if (
      "serviceWorker" in navigator &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        if (!registration.active) {
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
              alert("Service Worker registered successfully:" + registration);
            })
            .catch((err) => {
              alert("Service Worker registration failed:" + err);
            });
        }
      });
    }
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

  const requestPermission = async () => {
    if (!window.matchMedia("(display-mode: standalone)").matches) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        alert("aq");
        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
          vapidKey:
            "BLw4m1euAEwmBKDGCM-SDOvDDGNiooXLBGY8DgtLs_pngZTLaRmN6McSQ438ih8hsv3uRQRwtT3YdbNKuiwiWjw",
        });
        alert("User FCM token: " + token);
        setTimeout(() => {
          navigator.clipboard
            .writeText(token)
            .then(() => {
              alert("Texto copiado para a área de transferência!");
            })
            .catch((err) => {
              alert("Erro ao copiar texto: " + err);
            });
        }, 5000);

        // Salve este token no seu servidor para enviar notificações para este dispositivo
      } else {
        alert("Permission not granted for notifications");
      }
    } catch (error) {
      alert("Error getting permission for notifications:" + error);
    }
  };

  // Chame esta função em um botão ou automaticamente, dependendo da lógica do seu app

  return (
    <GlobalContext.Provider value={{ state, login, logout }}>
      {isLoading ? <Loading /> : children}
      <Button
        style={{ position: "absolute", zIndex: 1000, top: 0 }}
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
