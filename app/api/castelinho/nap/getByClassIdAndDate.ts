import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Nap } from "@/app/types/api/castelinho";

export type CastelinhoApiNapGetByClassIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: Nap[];
  };

const getByClassIdAndDate = async (
  accessToken: string,
  classId: number,
  date: string
): Promise<CastelinhoApiNapGetByClassIdAndDateResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiNapGetByClassIdAndDateResponse> =
      await castelinhoApiInstance.get(`/nap/?classId=${classId}&date=${date}`, {
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

export default getByClassIdAndDate;
