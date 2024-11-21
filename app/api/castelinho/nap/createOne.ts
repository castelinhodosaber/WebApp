// "data": {
//         "id": 23,
//         "studentId": 2,
//         "napTimeMinutes": 60,
//         "hour": "14:00:00",
//         "date": "2024-12-17"
//     }

import { AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { Nap } from "@/app/types/api/castelinho";

export type CastelinhoApiNapCreateOneResponse = CastelinhoApiResponseData & {
  data: Nap;
};

const createOne = async (
  accessToken: string,
  nap: Nap
): Promise<CastelinhoApiNapCreateOneResponse | undefined> => {
  const response: AxiosResponse<CastelinhoApiNapCreateOneResponse> =
    await castelinhoApiInstance.post(`/nap/`, nap, {
      headers: {
        Authorization: accessToken,
      },
    });
  return response.data;
};

export default createOne;
