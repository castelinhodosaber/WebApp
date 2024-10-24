const UNAUTHENTICATED_ROUTES = {
  login: "/",
};

const AUTHENTICATED_ROUTES = {
  dashboard: "/dashboard",
};

const routes = {
  ...UNAUTHENTICATED_ROUTES,
  ...AUTHENTICATED_ROUTES,
};

export default routes;
