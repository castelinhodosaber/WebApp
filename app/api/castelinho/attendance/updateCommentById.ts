import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";

export type CastelinhoApiAttendanceUpdateCommentByIdResponse =
  CastelinhoApiResponseData;

const updateCommentById = async (
  accessToken: string,
  comment: string,
  attendanceId: number
): Promise<CastelinhoApiAttendanceUpdateCommentByIdResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAttendanceUpdateCommentByIdResponse> =
      await castelinhoApiInstance.post(
        `/attendance/comment`,
        { comment, attendanceId },
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

export default updateCommentById;
