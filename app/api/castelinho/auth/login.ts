import { AxiosError } from "axios";
import castelinhoApiInstance, { CastelinhoApiResponseData } from "..";
import { toaster } from "@/components/ui/toaster";

export type CastelinhoApiAuthLoginResponse = CastelinhoApiResponseData & {
  response: {
    data: {
      data: {
        accessToken: string;
        person: {
          birthDate: string;
          cpf: string;
          gender: "Masculino" | "Feminino";
          id: number;
          name: string;
          role: "";
        };
      };
    };
  };
};

const login = async (
  username: string,
  password: string
): Promise<CastelinhoApiAuthLoginResponse | undefined> => {
  try {
    const response = (await castelinhoApiInstance.post("/auth/login", {
      username,
      password,
    })) as CastelinhoApiAuthLoginResponse;
    toaster.create({
      type: "success",
      title: "Bem vindo(a), " + response.data.data.person.name + ".",
    });

    return response.data.data;
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

export default login;
