import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import {
  Classes,
  Person,
  StudentGuardianRelationship,
} from "@/app/types/api/castelinho";

export type CastelinhoApiGuardianGetDetailsByIdResponse =
  CastelinhoApiResponseData & {
    data: Person & {
      students: (Person & {
        classes: Classes[];
        relationship: StudentGuardianRelationship;
      })[];
    };
  };

const getDetailsById = async (
  accessToken: string,
  guardianId: number
): Promise<CastelinhoApiGuardianGetDetailsByIdResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiGuardianGetDetailsByIdResponse> =
      await castelinhoApiInstance.get(`/guardian/${guardianId}`, {
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

export default getDetailsById;
