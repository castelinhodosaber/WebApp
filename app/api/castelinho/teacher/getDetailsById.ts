import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Classes, Person } from "@/app/types/api/castelinho";

export type CastelinhoApiTeacherGetDetailsByIdResponse =
  CastelinhoApiResponseData & {
    data: Person & { classes: (Classes & { students: Person[] })[] };
  };

const getDetailsById = async (
  accessToken: string,
  teacherId: number
): Promise<CastelinhoApiTeacherGetDetailsByIdResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiTeacherGetDetailsByIdResponse> =
      await castelinhoApiInstance.get(`/teacher/${teacherId}`, {
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
