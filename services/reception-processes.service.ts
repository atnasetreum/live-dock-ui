import axiosClient from "@/common/axiosClient";

export const receptionProcessesService = {
  baseUrl: "/reception-process",
  create: async (payload: { typeOfMaterial: string }) => {
    const { data } = await axiosClient.post(
      `${receptionProcessesService.baseUrl}`,
      payload,
    );
    return data;
  },
};
