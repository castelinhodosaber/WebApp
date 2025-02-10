import { CASTELINHO_API_ENDPOINTS } from "../api/castelinho";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const requestNotificationsPermission = async (accessToken: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      fetch("/api/firebaseConfig")
        .then((res) => res.json())
        .then(async (config) => {
          const app = initializeApp(config);
          const messaging = getMessaging(app);

          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY || "",
          });

          CASTELINHO_API_ENDPOINTS.notification
            .createOrUpdateFCMToken(accessToken || "", token)
            .then((_res) => {
              localStorage.setItem("FCMToken", token);
            });
        });
    } else {
      console.error("Permission not granted for notifications");
    }
  } catch (error) {
    console.error("Error getting permission for notifications:" + error);
  }
};

export default requestNotificationsPermission;
