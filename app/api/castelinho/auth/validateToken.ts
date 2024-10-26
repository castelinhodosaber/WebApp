import { AxiosError } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Gender, Role } from "@/app/types/api/castelinho";

export type CastelinhoApiAuthValidadeTokenResponse =
  CastelinhoApiResponseData & {
    response: {
      data: {
        data: {
          birthDate: string;
          cpf: string;
          gender: Gender;
          id: number;
          name: string;
          role: Role;
        };
      };
    };
  };

const validateToken = async (
  accessToken: string
): Promise<CastelinhoApiAuthValidadeTokenResponse | undefined> => {
  try {
    const response = (await castelinhoApiInstance.get("/auth/validate", {
      headers: {
        Authorization: accessToken,
      },
    })) as CastelinhoApiAuthValidadeTokenResponse;

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toaster.create({
        type: "error",
        title: error.response?.data.message || "Erro desconhecido.",
      });
    } else {
      toaster.create({
        type: "error",
        title: "Erro desconhecido. Tente novamente mais tarde.",
      });
    }
  }
};

export default validateToken;
