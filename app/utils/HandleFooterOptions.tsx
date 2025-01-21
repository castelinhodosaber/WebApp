import { IoHome } from "react-icons/io5";
import { Role } from "../types/api/castelinho";
import ROUTES from "../routes";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaBookOpen, FaEnvelope } from "react-icons/fa";
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
          icon: (
            <BiSolidMessageDetail style={{ height: "100%", width: "100%" }} />
          ),
          name: "Recados",
          pathname: ROUTES.private.teacher.annotation,
        },
        {
          icon: <FaBookOpen style={{ height: "100%", width: "100%" }} />,
          name: "Anotações",
          pathname: ROUTES.private.teacher.message,
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
