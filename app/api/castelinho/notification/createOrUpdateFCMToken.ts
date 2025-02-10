import castelinhoApiInstance from "..";

const createOrUpdateFCMToken = async (
  accessToken: string,
  fcmToken: string
) => {
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
};

export default createOrUpdateFCMToken;
