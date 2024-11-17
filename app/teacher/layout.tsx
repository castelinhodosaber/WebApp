import { ReactNode } from "react";
import { TeacherProvider } from "../context/TeacherContext";
import TeacherFooter from "../components/TeacherFooter";

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  return (
    <TeacherProvider>
      {children}
      <TeacherFooter />
    </TeacherProvider>
  );
};

export default TeacherLayout;
