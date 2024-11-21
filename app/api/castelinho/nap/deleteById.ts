import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";

export type CastelinhoApiNapDeleteById = CastelinhoApiResponseData;

const deleteById = async (
  accessToken: string,
  napId: number
): Promise<CastelinhoApiNapDeleteById | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiNapDeleteById> =
      await castelinhoApiInstance.delete(`/nap/${napId}`, {
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

export default deleteById;
