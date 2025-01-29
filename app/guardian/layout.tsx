import { ReactNode } from "react";
import { GuardianProvider } from "../context/GuardianContext";
import GuardianFooter from "../components/GuardianFooter";

const GuardianLayout = ({ children }: { children: ReactNode }) => {
  return (
    <GuardianProvider>
      {children}
      <GuardianFooter />
    </GuardianProvider>
  );
};

export default GuardianLayout;
