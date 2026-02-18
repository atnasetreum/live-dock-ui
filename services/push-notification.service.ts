import axiosClient from "@/common/axiosClient";

export const pushNotificationsService = {
  baseUrl: "/push-notifications",
  allTest: async (userId?: string) => {
    const { data } = await axiosClient.get(
      `${pushNotificationsService.baseUrl}/test-all`,
      {
        params: { userId },
      },
    );
    return data;
  },
};
