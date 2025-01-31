import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import {
  Attendance,
  Bath,
  Bathroom,
  Classes,
  Meal,
  Nap,
  Person,
  StudentGuardianRelationship,
} from "@/app/types/api/castelinho";

export type CastelinhoApiStudentGetDetailsByIdAndDateResponse =
  CastelinhoApiResponseData & {
    data: Person & {
      classes: Classes[];
      bathrooms?: Bathroom[];
      baths?: Bath[];
      meals?: Meal[];
      naps?: Nap[];
      relationship?: StudentGuardianRelationship;
      attendances: Attendance[];
    };
  };

const getDetailsByIdAndDate = async (
  accessToken: string,
  studentId: number,
  date: string
): Promise<CastelinhoApiStudentGetDetailsByIdAndDateResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiStudentGetDetailsByIdAndDateResponse> =
      await castelinhoApiInstance.get(`/student/${studentId}?date=${date}`, {
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

export default getDetailsByIdAndDate;
