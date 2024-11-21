import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Bath } from "@/app/types/api/castelinho";

export type CastelinhoApiMealCreateManyResponse = CastelinhoApiResponseData;

const createMany = async (
  accessToken: string,
  baths: Bath[]
): Promise<CastelinhoApiMealCreateManyResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiMealCreateManyResponse> =
      await castelinhoApiInstance.post(
        `/bath/list`,
        baths.map((bath) => ({
          date: bath.date,
          status: bath.status,
          studentId: bath.studentId,
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
