import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Gender, Role } from "@/app/types/api/castelinho";

export type CastelinhoApiAuthLoginResponse = CastelinhoApiResponseData & {
  data: {
    accessToken: string;
    person: {
      birthDate: string;
      cpf: string;
      gender: Gender;
      id: number;
      name: string;
      role: Role;
      roleId: number;
    };
  };
};

const login = async (
  username: string,
  password: string
): Promise<CastelinhoApiAuthLoginResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAuthLoginResponse> =
      await castelinhoApiInstance.post("/auth/login", {
        username,
        password,
      });
    localStorage.setItem("accessToken", response.data.data.accessToken);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toaster.create({
        type: "error",
        title:
          error.response?.data.message ||
          "Erro interno. Tente novamente mais tarde.",
      });
    } else {
      toaster.create({
        type: "error",
        title: "Erro desconhecido. Tente novamente mais tarde.",
      });
    }
  }
};

export default login;
