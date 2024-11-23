import { AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { Bath } from "@/app/types/api/castelinho";

export type CastelinhoApiBathCreateOneResponse = CastelinhoApiResponseData & {
  data: Bath;
};

const createOne = async (
  accessToken: string,
  bath: Bath
): Promise<CastelinhoApiBathCreateOneResponse | undefined> => {
  const response: AxiosResponse<CastelinhoApiBathCreateOneResponse> =
    await castelinhoApiInstance.post(`/bath/`, bath, {
      headers: {
        Authorization: accessToken,
      },
    });
  return response.data;
};

export default createOne;
