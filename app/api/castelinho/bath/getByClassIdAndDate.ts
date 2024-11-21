import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Bath } from "@/app/types/api/castelinho";

export type CastelinhoApiBathGetByClassIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: Bath[];
  };

const getByClassIdAndDate = async (
  accessToken: string,
  classId: number,
  date: string
): Promise<CastelinhoApiBathGetByClassIdAndDateResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiBathGetByClassIdAndDateResponse> =
      await castelinhoApiInstance.get(
        `/bath/?classId=${classId}&date=${date}`,
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
