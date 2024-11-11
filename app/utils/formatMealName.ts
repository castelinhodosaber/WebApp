import { MealTypes } from "../types/api/castelinho";

const formatMealName = (mealName: MealTypes) => {
  switch (mealName) {
    case "afternoonFruit":
      return "Fruta da Tarde";

    case "afternoonSnack":
      return "Lanche da Tarde";

    case "lunch":
      return "Almoço";

    case "milkFeeding":
      return "Mamadeira";

    case "morningFruit":
      return "Fruta da Manhã";

    case "morningSnack":
      return "Lanche da Manhã";
    default:
      return undefined;
  }
};

export default formatMealName;
