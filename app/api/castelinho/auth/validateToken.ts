import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Gender, Role } from "@/app/types/api/castelinho";

export type CastelinhoApiAuthValidadeTokenResponse =
  CastelinhoApiResponseData & {
    data: {
      birthDate: string;
      cpf: string;
      gender: Gender;
      personId: number;
      name: string;
      role: Role;
      roleId: number;
      iat: number;
      exp: number;
    };
  };
const validateToken = async (
  accessToken: string
): Promise<CastelinhoApiAuthValidadeTokenResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAuthValidadeTokenResponse> =
      await castelinhoApiInstance.get("/auth/validate", {
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
        title: error.response?.data.message || "Erro desconhecido.",
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

export default validateToken;
