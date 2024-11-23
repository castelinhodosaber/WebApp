import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Bathroom } from "@/app/types/api/castelinho";

export type CastelinhoApiBathroomCreateManyResponse = CastelinhoApiResponseData;

const createMany = async (
  accessToken: string,
  bathrooms: Bathroom[]
): Promise<CastelinhoApiBathroomCreateManyResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiBathroomCreateManyResponse> =
      await castelinhoApiInstance.post(
        `/bath/list`,
        bathrooms.map((bathroom) => ({
          date: bathroom.date,
          studentId: bathroom.studentId,
          amount: bathroom.amount,
          action: bathroom.action,
          actionDetail: bathroom.actionDetail,
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
