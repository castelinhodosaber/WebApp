import { AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { Bathroom } from "@/app/types/api/castelinho";

export type CastelinhoApiBathroomCreateOneResponse =
  CastelinhoApiResponseData & {
    data: Bathroom;
  };

const createOne = async (
  accessToken: string,
  bathroom: Bathroom
): Promise<CastelinhoApiBathroomCreateOneResponse | undefined> => {
  const response: AxiosResponse<CastelinhoApiBathroomCreateOneResponse> =
    await castelinhoApiInstance.post(`/bathroom/`, bathroom, {
      headers: {
        Authorization: accessToken,
      },
    });
  return response.data;
};

export default createOne;
