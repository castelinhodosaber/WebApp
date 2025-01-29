import { IoHome } from "react-icons/io5";
import { Role } from "../types/api/castelinho";
import ROUTES from "../routes";
import { FaEnvelope } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { BiSolidMessageDetail } from "react-icons/bi";

const handleFooterOptions = (userRole: Role) => {
  switch (userRole) {
    case "guardian":
      return [
        {
          icon: <IoHome style={{ height: "100%", width: "100%" }} />,
          name: "Início",
          pathname: [ROUTES.private.guardian.home],
        },
        {
          icon: (
            <BiSolidMessageDetail style={{ height: "100%", width: "100%" }} />
          ),
          name: "Deixar Recado",
          pathname: ROUTES.private.guardian.annotation,
        },
        {
          icon: <FaEnvelope style={{ height: "100%", width: "100%" }} />,
          name: "Comunicados",
          pathname: ROUTES.private.guardian.announcement,
        },
        {
          icon: <RiLogoutBoxFill style={{ height: "100%", width: "100%" }} />,
          name: "Sair",
          pathname: ROUTES.public.logout,
        },
      ];
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
