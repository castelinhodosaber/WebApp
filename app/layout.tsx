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
    icon: "/assets/icons/icon-24x24.png",
    apple: "/assets/icons/icon-512x512.png",
  },
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <Toaster />
            <GlobalProvider>{children}</GlobalProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
