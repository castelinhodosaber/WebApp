import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Classes } from "@/app/types/api/castelinho";

export type CastelinhoApiclassgetAllResponse = CastelinhoApiResponseData & {
  data: Classes[];
};

const getAll = async (
  accessToken: string
): Promise<CastelinhoApiclassgetAllResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiclassgetAllResponse> =
      await castelinhoApiInstance.get(`/class/`, {
        headers: {
          Authorization: accessToken,
        },
      });

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

export default getAll;
