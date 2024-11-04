export const TEACHER_ROUTES = {
  annotation: "/teacher/annotation",
  announcement: "/teacher/announcement",
  dashboard: "/teacher/dashboard",
  message: "/teacher/message",
  attendance: "/teacher/attendance",
  home: "/teacher/home",
} as const;

export const PUBLIC_ROUTES: { [key: string]: string } = {
  login: "/",
} as const;

export const PRIVATE_ROUTES = {
  teacher: { ...TEACHER_ROUTES },
} as const;

const ROUTES = {
  public: { ...PUBLIC_ROUTES },
  private: { ...PRIVATE_ROUTES },
} as const;

export default ROUTES;
