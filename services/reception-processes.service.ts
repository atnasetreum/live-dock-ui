import axiosClient from "@/common/axiosClient";
import { ReceptionProcess } from "@/types";

export type ReceptionProcessFilters = {
  search?: string;
  typeOfMaterial?: string;
  status?: string;
  startDate: string;
  endDate: string;
};

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
  findAll: async ({
    search,
    typeOfMaterial,
    status,
    startDate,
    endDate,
  }: ReceptionProcessFilters) => {
    const { data } = await axiosClient.get<ReceptionProcess[]>(
      `${receptionProcessesService.baseUrl}`,
      {
        params: {
          search: search || undefined,
          typeOfMaterial: typeOfMaterial || undefined,
          status: status || undefined,
          startDate,
          endDate,
        },
      },
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
