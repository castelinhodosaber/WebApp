import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { MealType } from "@/app/types/api/castelinho";

export type CastelinhoApiMealTypeGetByClassIdResponse =
  CastelinhoApiResponseData & {
    data: MealType[];
  };

const getByClassId = async (
  accessToken: string,
  classId: number
): Promise<CastelinhoApiMealTypeGetByClassIdResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiMealTypeGetByClassIdResponse> =
      await castelinhoApiInstance.get(`/mealType/?classId=${classId}`, {
        headers: {
          Authorization: accessToken,
        },
      });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toaster.create({
        meta: { closable: true },
        type: "error",
        title: error.response?.data.message,
      });
    } else {
      toaster.create({
        meta: { closable: true },
        type: "error",
        title: "Erro desconhecido. Tente novamente mais tarde.",
      });
    }
  }
};

export default getByClassId;
