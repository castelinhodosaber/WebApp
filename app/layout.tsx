import { Provider } from "@/components/ui/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda Castelinho",
  description: "Diário de aluno na Castelinho do Saber",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/icons/icon-192x192.png",
    apple: "/assets/icons/icon-512x512.png",
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
