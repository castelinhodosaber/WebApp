import { ReactNode } from "react";
import { PrincipalProvider } from "../context/PrincipalContext";
import PrincipalFooter from "../components/PrincipalFooter";

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PrincipalProvider>
      {children}
      <PrincipalFooter />
    </PrincipalProvider>
  );
};

export default TeacherLayout;
