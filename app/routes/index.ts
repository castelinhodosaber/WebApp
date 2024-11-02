export const TEACHER_ROUTES: { [key: string]: string } = {
  annotation: "/teacher/annotation",
  announcement: "/teacher/announcement",
  dashboard: "/teacher/dashboard",
  message: "/teacher/message",
  attendance: "/teacher/attendance",
};

export const PUBLIC_ROUTES: { [key: string]: string } = {
  login: "/",
} as const;

export const PRIVATE_ROUTES: { [key: string]: { [key: string]: string } } = {
  teacher: { ...TEACHER_ROUTES },
};

const ROUTES: {
  public: { [key: string]: string };
  private: { [key: string]: { [key: string]: string } };
} = {
  public: { ...PUBLIC_ROUTES },
  private: { ...PRIVATE_ROUTES },
};

export default ROUTES;
