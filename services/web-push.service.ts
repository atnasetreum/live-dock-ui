import axiosClient from "@/common/axiosClient";

export const webPushService = {
  baseUrl: "/push-notifications",
  getPublicKey: async (): Promise<BufferSource> => {
    const { data } = await axiosClient.get(
      `${webPushService.baseUrl}/public-key`,
    );
    return Buffer.from(new Uint8Array(data.data));
  },
  createSubscribe: async (subscription: PushSubscription) => {
    const { data } = await axiosClient.post(
      `${webPushService.baseUrl}/subscribe`,
      { subscription },
    );
    return data;
  },
  unsubscribe: async (subscription: PushSubscription) => {
    const { data } = await axiosClient.post(
      `${webPushService.baseUrl}/unsubscribe`,
      { subscription },
    );
    return data;
  },
};
