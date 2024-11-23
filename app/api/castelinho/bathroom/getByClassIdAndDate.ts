import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Bathroom } from "@/app/types/api/castelinho";

export type CastelinhoApiBathroomGetByClassIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: Bathroom[];
  };

const getByClassIdAndDate = async (
  accessToken: string,
  classId: number,
  date: string
): Promise<CastelinhoApiBathroomGetByClassIdAndDateResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiBathroomGetByClassIdAndDateResponse> =
      await castelinhoApiInstance.get(
        `/bathroom/?classId=${classId}&date=${date}`,
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
