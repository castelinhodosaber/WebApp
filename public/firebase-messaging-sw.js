/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

// Use importScripts para importar os SDKs do Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

// Configuração do Firebase
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
firebase.initializeApp(firebaseConfig);

// Inicialize o Firebase Messaging
const messaging = firebase.messaging();

// Manipule mensagens recebidas em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/assets/icons/icon-192x192.png", // Substitua pelo caminho correto do ícone
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
