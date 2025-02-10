import { toaster } from "@/components/ui/toaster";
import castelinhoApiInstance from "..";
import { AxiosError } from "axios";

const createOrUpdateFCMToken = async (
  accessToken: string,
  fcmToken: string
) => {
  try {
    const response = await castelinhoApiInstance.post(
      `/notification/FCMToken/${fcmToken}`,
      {},
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toaster.create({
        meta: { closable: true },
        type: "error",
        title: error.response?.data.message,
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

export default createOrUpdateFCMToken;
