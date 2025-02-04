import { AxiosError } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { GuardianAnnotation } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";

export type CastelinhoApiGuardianAnnotationGetByGuardianResponse =
  CastelinhoApiResponseData & {
    data?: GuardianAnnotation[];
    pagination?: Pagination;
  };

const getByGuardian = async (
  accessToken: string,

  pagination: Pagination,
  search?: string
): Promise<
  CastelinhoApiGuardianAnnotationGetByGuardianResponse | undefined
> => {
  try {
    const response: CastelinhoApiGuardianAnnotationGetByGuardianResponse =
      await castelinhoApiInstance.get(
        `/guardianAnnotation/?limit=${pagination.limit}&page=${
          pagination.page
        }&search=${search || ""}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

    return response;
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

export default getByGuardian;
