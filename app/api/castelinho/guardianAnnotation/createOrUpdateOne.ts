import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { GuardianAnnotation } from "@/app/types/api/castelinho";

export type CastelinhoApiGuardianAnnotationCreateOrUpdateOneResponse =
  CastelinhoApiResponseData & {
    data: [
      {
        id?: number;
        studentId: number;
        description: string;
        date: string;
        guardianId: number;
      },
      boolean
    ];
  };

const createOrUpdateOne = async (
  accessToken: string,
  guardianAnnotation: GuardianAnnotation
): Promise<
  CastelinhoApiGuardianAnnotationCreateOrUpdateOneResponse | undefined
> => {
  try {
    const response: AxiosResponse<CastelinhoApiGuardianAnnotationCreateOrUpdateOneResponse> =
      await castelinhoApiInstance.post(
        `/guardianAnnotation/`,
        guardianAnnotation,
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

export default createOrUpdateOne;
