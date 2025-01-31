import { MealTypes } from "../types/api/castelinho";

const formatMealName = (mealName: MealTypes) => {
  switch (mealName) {
    case "afternoonSnack":
      return "Lanche da Tarde";

    case "lunch":
      return "Almoço";

    case "milkFeeding":
      return "Mamadeira";

    case "morningSnack":
      return "Lanche da Manhã";
    default:
      return undefined;
  }
};

export default formatMealName;
