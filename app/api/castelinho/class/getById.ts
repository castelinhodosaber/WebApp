import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Classes, Person } from "@/app/types/api/castelinho";

export type CastelinhoApiClassesGetByIdResponse = CastelinhoApiResponseData & {
  data: Classes & { students: Person[] };
};

const getById = async (
  accessToken: string,
  classId: number
): Promise<CastelinhoApiClassesGetByIdResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiClassesGetByIdResponse> =
      await castelinhoApiInstance.get(`/class/${classId}`, {
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

export default getById;
