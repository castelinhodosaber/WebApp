import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { GuardianAnnotation } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";

export type CastelinhoApiGuardianAnnotationGetByClassIdResponse =
  CastelinhoApiResponseData & {
    data: GuardianAnnotation[];
    pagination: Pagination;
  };

const getByClassId = async (
  accessToken: string,
  classId: number,
  pagination: Pagination,
  search?: string
): Promise<CastelinhoApiGuardianAnnotationGetByClassIdResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiGuardianAnnotationGetByClassIdResponse> =
      await castelinhoApiInstance.get(
        `/guardianAnnotation/all?classId=${classId}&limit=${
          pagination.limit
        }&page=${pagination.page}&search=${search || ""}`,
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

export default getByClassId;
