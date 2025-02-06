import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";

export type CastelinhoApiGuardianAnnotationDeleteById =
  CastelinhoApiResponseData;

const deleteById = async (
  accessToken: string,
  guardianAnnotationId: number
): Promise<CastelinhoApiGuardianAnnotationDeleteById | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiGuardianAnnotationDeleteById> =
      await castelinhoApiInstance.delete(
        `/guardianAnnotation/${guardianAnnotationId}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
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

export default deleteById;
