import { Role, TranslatedRole } from "../types/api/castelinho";

const translateRole: (role: Role) => TranslatedRole = (role) => {
  switch (role) {
    case "guardian":
      return "responsável";

    case "principal":
      return "diretoria";

    case "teacher":
      return "professor";
    default:
      return "estudante";
  }
};

export default translateRole;
