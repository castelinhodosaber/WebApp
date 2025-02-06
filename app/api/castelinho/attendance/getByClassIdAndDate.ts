import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Attendance } from "@/app/types/api/castelinho";

export type CastelinhoApiAttendanceGetByClassIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: Attendance[];
  };

const getByClassIdAndDate = async (
  accessToken: string,
  classId: number,
  date: string
): Promise<CastelinhoApiAttendanceGetByClassIdAndDateResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAttendanceGetByClassIdAndDateResponse> =
      await castelinhoApiInstance.get(
        `/attendance/?classId=${classId}&date=${date}`,
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

export default getByClassIdAndDate;
