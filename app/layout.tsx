import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { GlobalProvider } from "./context/GlobalContext";

export const metadata: Metadata = {
  title: "Agenda Castelinho",
  description: "Diário de aluno na Castelinho do Saber",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/icons/icon-192x192.png",
    apple: "/assets/icons/apple-touch-icon.png",
  },
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Provider>
          <ThemeProvider attribute="class">
            <Toaster />
            <GlobalProvider>{children}</GlobalProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
