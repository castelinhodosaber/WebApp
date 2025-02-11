import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../routes";
import { Role } from "../types/api/castelinho";

const verifyRoute = (route: string, role?: Role) => {
  const publicRoutesArr = Object.values(PUBLIC_ROUTES) as string[];

  if (role) {
    switch (role) {
      case "teacher":
        const teacherPrivateRoutesArr = Object.values(PRIVATE_ROUTES.teacher);

        if (
          teacherPrivateRoutesArr.some((teacherRoute) => teacherRoute === route)
        )
          return "private";

      case "principal":
        const principalPrivateRoutesArr = Object.values(
          PRIVATE_ROUTES.principal
        );

        if (
          principalPrivateRoutesArr.some(
            (principalRoute) => principalRoute === route
          )
        )
          return "private";

      case "guardian":
        const guardianPrivateRoutesArr = Object.values(PRIVATE_ROUTES.guardian);

        if (
          guardianPrivateRoutesArr.some(
            (guardianRoute) => guardianRoute === route
          )
        )
          return "private";

      default:
        break;
    }
  }

  if (publicRoutesArr.includes(route)) return "public";
  return "unknown";
};

export default verifyRoute;
