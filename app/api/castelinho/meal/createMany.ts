import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Meal } from "@/app/types/api/castelinho";

export type CastelinhoApiMealCreateManyResponse = CastelinhoApiResponseData;

const createMany = async (
  accessToken: string,
  meals: Meal[]
): Promise<CastelinhoApiMealCreateManyResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiMealCreateManyResponse> =
      await castelinhoApiInstance.post(
        `/meal/list`,
        meals.map((meal) => ({
          date: meal.date,
          rating: meal.rating,
          mealTypeId: meal.mealTypeId,
          studentId: meal.studentId,
        })),
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toaster.create({ type: "error", title: error.response?.data.message });
    } else {
      toaster.create({
        type: "error",
        title: "Erro desconhecido. Tente novamente mais tarde.",
      });
    }
  }
};

export default createMany;
