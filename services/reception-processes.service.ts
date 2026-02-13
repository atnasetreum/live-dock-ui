import axiosClient from "@/common/axiosClient";
import {
  ProcessEventOption,
  ProcessEventRole,
  ProcessState,
  ReceptionProcess,
} from "@/types";

export const receptionProcessesService = {
  baseUrl: "/reception-process",
  create: async (payload: { typeOfMaterial: string }) => {
    const { data } = await axiosClient.post<ReceptionProcess>(
      `${receptionProcessesService.baseUrl}`,
      payload,
    );
    return data;
  },
  findAll: async () => {
    const { data } = await axiosClient.get<ReceptionProcess[]>(
      `${receptionProcessesService.baseUrl}`,
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
    newState: string;
    actionRole: string;
    nextEvent: {
      event: ProcessEventOption;
      statusProcess: ProcessState;
      eventRole: ProcessEventRole;
    };
  }) {
    return axiosClient.post(
      `${receptionProcessesService.baseUrl}/change-of-status`,
      payload,
    );
  },
};
