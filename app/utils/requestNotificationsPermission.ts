import { CASTELINHO_API_ENDPOINTS } from "../api/castelinho";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const requestNotificationsPermission = async (accessToken: string) => {
  const requestNotificationButton: HTMLButtonElement | null =
    document.getElementById(
      "request-notification-button"
    ) as HTMLButtonElement | null;

  if (requestNotificationButton) requestNotificationButton.style.opacity = "0%";

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
              localStorage.removeItem("accessToken");
            });
        });
    } else {
      console.log("Permission not granted for notifications");
    }
  } catch (error) {
    console.log("Error getting permission for notifications:" + error);
  }

  if (requestNotificationButton) requestNotificationButton.remove();
};

export default requestNotificationsPermission;
