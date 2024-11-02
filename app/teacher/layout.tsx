import { ReactNode } from "react";
import { TeacherProvider } from "../context/TeacherContext";

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  return <TeacherProvider>{children}</TeacherProvider>;
};

export default TeacherLayout;
