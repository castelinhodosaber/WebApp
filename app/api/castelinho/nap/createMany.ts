import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Nap } from "@/app/types/api/castelinho";

export type CastelinhoApiNapCreateManyResponse = CastelinhoApiResponseData;

const createMany = async (
  accessToken: string,
  naps: Nap[]
): Promise<CastelinhoApiNapCreateManyResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiNapCreateManyResponse> =
      await castelinhoApiInstance.post(
        `/nap/list`,
        naps.map((nap) => ({
          date: nap.date,
          hour: nap.hour,
          napTimeMinutes: nap.napTimeMinutes,
          studentId: nap.studentId,
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
