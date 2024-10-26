export const PUBLIC_ROUTES = {
  login: "/",
};

export const PRIVATE_ROUTES = {
  annotation: "/annotation",
  announcement: "/announcement",
  dashboard: "/dashboard",
  message: "/message",
};

const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PRIVATE_ROUTES,
};

export default ROUTES;
