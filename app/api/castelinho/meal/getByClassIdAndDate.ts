import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Meal } from "@/app/types/api/castelinho";

export type CastelinhoApiMealGetByClassIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: Meal[];
  };

const getByClassIdAndDate = async (
  accessToken: string,
  classId: number,
  date: string
): Promise<CastelinhoApiMealGetByClassIdAndDateResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiMealGetByClassIdAndDateResponse> =
      await castelinhoApiInstance.get(
        `/meal/?classId=${classId}&date=${date}`,
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

export default getByClassIdAndDate;
