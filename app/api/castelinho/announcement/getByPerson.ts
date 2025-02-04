import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Announcement } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";

export type CastelinhoApiAnnouncementGetAllResponse =
  CastelinhoApiResponseData & {
    data: Announcement[];
    pagination: Pagination;
  };

const getByPerson = async (
  accessToken: string,
  pagination: Pagination
): Promise<CastelinhoApiAnnouncementGetAllResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAnnouncementGetAllResponse> =
      await castelinhoApiInstance.get(
        `/announcement/?limit=${pagination.limit}&page=${pagination.page}`,
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

export default getByPerson;
