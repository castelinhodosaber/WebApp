import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../routes";
import { Role } from "../types/api/castelinho";

const verifyRoute = (route: string, role?: Role) => {
  const publicRoutesArr = Object.values(PUBLIC_ROUTES);

  if (role) {
    switch (role) {
      case "teacher":
        const teacherPrivateRoutesArr = Object.values(PRIVATE_ROUTES.teacher);

        if (
          teacherPrivateRoutesArr.some((teacherRoute) => teacherRoute === route)
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
