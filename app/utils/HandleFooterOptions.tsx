import { IoHome } from "react-icons/io5";
import { Role } from "../types/api/castelinho";
import ROUTES from "../routes";
import { FaEnvelope } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";

const handleFooterOptions = (userRole: Role) => {
  switch (userRole) {
    case "teacher":
      return [
        {
          icon: <IoHome style={{ height: "100%", width: "100%" }} />,
          name: "Início",
          pathname: [
            ROUTES.private.teacher.dashboard,
            ROUTES.private.teacher.home,
          ],
        },
        {
          icon: <FaEnvelope style={{ height: "100%", width: "100%" }} />,
          name: "Comunicados",
          pathname: ROUTES.private.teacher.announcement,
        },
        {
          icon: <RiLogoutBoxFill style={{ height: "100%", width: "100%" }} />,
          name: "Sair",
          pathname: ROUTES.public.logout,
        },
      ];

    default:
      return [];
  }
};

export default handleFooterOptions;
