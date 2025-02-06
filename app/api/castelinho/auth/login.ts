import { AxiosError, AxiosResponse } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";
import { Gender, Role } from "@/app/types/api/castelinho";

export type CastelinhoApiAuthLoginResponse = CastelinhoApiResponseData & {
  data:
    | {
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
      }
    | {
        roles: { role: Role; roleId: number }[];
        person: {
          name: string;
          cpf: string;
          birthDate: string;
          gender: Gender;
          id: number;
        };
      };
};

const login = async (
  username: string,
  password: string,
  rememberUser: boolean,
  role?: Role
): Promise<CastelinhoApiAuthLoginResponse | undefined> => {
  try {
    const response: AxiosResponse<CastelinhoApiAuthLoginResponse> =
      await castelinhoApiInstance.post("/auth/login", {
        username,
        password,
        role,
      });

    if (response && "accessToken" in response.data.data && rememberUser)
      localStorage.setItem("accessToken", response.data.data.accessToken);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toaster.create({
        meta: { closable: true },
        type: "error",
        title:
          error.response?.data.message ||
          "Erro interno. Tente novamente mais tarde.",
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

export default login;
