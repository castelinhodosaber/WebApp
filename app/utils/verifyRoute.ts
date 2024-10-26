import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../routes";

const verifyRoute = (route: string) => {
  const privateRoutesArr = Object.values(PRIVATE_ROUTES);
  const publicRoutesArr = Object.values(PUBLIC_ROUTES);

  if (privateRoutesArr.includes(route)) return "private";
  if (publicRoutesArr.includes(route)) return "public";
  return "unknown";
};

export default verifyRoute;
