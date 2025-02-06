export const TEACHER_ROUTES = {
  annotation: "/teacher/annotation",
  announcement: "/teacher/announcement",
  dashboard: "/teacher/dashboard",
  message: "/teacher/message",
  attendance: "/teacher/attendance",
  home: "/teacher/home",
  meal: "/teacher/meal",
  nap: "/teacher/nap",
  bath: "/teacher/bath",
  bathroom: "/teacher/bathroom",
} as const;

export const PRINCIPAL_ROUTES = {
  annotation: "/teacher/annotation",
  announcement: "/teacher/announcement",
  dashboard: "/teacher/dashboard",
  message: "/teacher/message",
  attendance: "/teacher/attendance",
  home: "/teacher/home",
  meal: "/teacher/meal",
  nap: "/teacher/nap",
  bath: "/teacher/bath",
  bathroom: "/teacher/bathroom",
} as const;

export const GUARDIAN_ROUTES = {
  annotation: "/guardian/annotation",
  announcement: "/guardian/announcement",

  message: "/guardian/message",
  attendance: "/guardian/attendance",
  home: "/guardian/home",
} as const;

export const PUBLIC_ROUTES = {
  login: "/",
  logout: "/logout",
} as const;

export const PRIVATE_ROUTES = {
  teacher: { ...TEACHER_ROUTES },
  guardian: { ...GUARDIAN_ROUTES },
  principal: { ...PRINCIPAL_ROUTES },
} as const;

const ROUTES = {
  public: { ...PUBLIC_ROUTES },
  private: { ...PRIVATE_ROUTES },
} as const;

export default ROUTES;
