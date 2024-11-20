import { AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { Nap } from "@/app/types/api/castelinho";

export type CastelinhoApiNapCreateManyResponse = CastelinhoApiResponseData;

const createMany = async (
  accessToken: string,
  naps: Nap[]
): Promise<CastelinhoApiNapCreateManyResponse | undefined> => {
  const response: AxiosResponse<CastelinhoApiNapCreateManyResponse> =
    await castelinhoApiInstance.post(
      `/nap/list`,
      naps.map((nap) => ({
        date: nap.date,
        hour: nap.hour,
        napTimeMinutes: nap.napTimeMinutes,
        studentId: nap.studentId,
      })),
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
  return response.data;
};

export default createMany;
