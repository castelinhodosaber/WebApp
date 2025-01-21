import { Gender, StudentGuardianRelationship } from "../types/api/castelinho";

const formatRelationship = (
  gender: Gender,
  relation: StudentGuardianRelationship
) => {
  if (gender === "male") {
    switch (relation) {
      case "parent":
        return "pai";

      case "stepparent":
        return "padrasto";

      case "grandparent":
        return "avô";

      case "uncle":
        return "tio";
      default:
        return "responsável";
    }
  } else {
    switch (relation) {
      case "parent":
        return "mãe";

      case "stepparent":
        return "madrasta";

      case "grandparent":
        return "avó";

      case "uncle":
        return "tia";
      default:
        return "responsável";
    }
  }
};

export default formatRelationship;
