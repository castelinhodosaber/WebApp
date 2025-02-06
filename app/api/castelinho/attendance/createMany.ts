import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Attendance } from "@/app/types/api/castelinho";

export type CastelinhoApiAttendanceCreateManyResponse =
  CastelinhoApiResponseData & {
    data: Attendance[];
  };

const createMany = async (
  accessToken: string,
  attendances: Attendance[]
): Promise<CastelinhoApiAttendanceCreateManyResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAttendanceCreateManyResponse> =
      await castelinhoApiInstance.post(`/attendance/list`, attendances, {
        headers: {
          Authorization: accessToken,
        },
      });
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

export default createMany;
