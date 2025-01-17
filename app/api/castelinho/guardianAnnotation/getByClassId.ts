import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { GuardianAnnotation } from "@/app/types/api/castelinho";

export type CastelinhoApiGuardianAnnotationGetByClassIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: GuardianAnnotation[];
  };

const getByClassId = async (
  accessToken: string,
  classId: number
): Promise<
  CastelinhoApiGuardianAnnotationGetByClassIdAndDateResponse | undefined
> => {
  try {
    const response: AxiosResponse<CastelinhoApiGuardianAnnotationGetByClassIdAndDateResponse> =
      await castelinhoApiInstance.get(
        `/guardianAnnotation/all?classId=${classId}`,
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

export default getByClassId;
