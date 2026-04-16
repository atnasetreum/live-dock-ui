import axiosClient from "@/common/axiosClient";
import { ReceptionProcess } from "@/types";

export const receptionProcessesService = {
  baseUrl: "/reception-process",
  create: async (payload: {
    providerName: string;
    licensePlates: string;
    typeOfMaterial: string;
  }) => {
    const { data } = await axiosClient.post<ReceptionProcess>(
      `${receptionProcessesService.baseUrl}`,
      payload,
    );
    return data;
  },
  findAll: async ({ startDate }: { startDate: string }) => {
    console.log({ startDate });
    const { data } = await axiosClient.get<ReceptionProcess[]>(
      `${receptionProcessesService.baseUrl}`,
      /* {
        params: { startDate },
      }, */
    );
    return data;
  },
  findOne: async (id: string) => {
    const { data } = await axiosClient.get<ReceptionProcess>(
      `${receptionProcessesService.baseUrl}/${id}`,
    );
    return data;
  },
  changeOfStatus(payload: {
    id: number;
    actionRole: string;
    rejectionNotes?: string;
  }) {
    return axiosClient.post(
      `${receptionProcessesService.baseUrl}/change-of-status`,
      payload,
    );
  },
  findAllPriorityAlerts: async ({ startDate }: { startDate: string }) => {
    const { data } = await axiosClient.get<
      {
        title: string;
        detail: string;
        severity: "Alta" | "Media" | "Baja";
      }[]
    >(`${receptionProcessesService.baseUrl}/priority-alerts`, {
      params: { startDate },
    });
    return data;
  },
  notifyMetric: async (payload: {
    id: number;
    notifiedUserId: number;
    actionConfirm: string;
    visibleAt: number;
    reactionTimeSec: number;
    accionAt: string;
    systemDelaySec: number;
    eventType: string;
    metadata: string;
  }) => {
    const { data } = await axiosClient.post(
      `${receptionProcessesService.baseUrl}/notify-metric`,
      payload,
    );
    return data;
  },
};
