import axiosClient from "@/common/axiosClient";
import { ProcessEventRole, User } from "@/types";

export interface UserPayload {
  name: string;
  email: string;
  role: ProcessEventRole;
  password?: string;
  isActive?: boolean;
}

export const usersService = {
  baseUrl: "/users",
  findAll: async () => {
    const { data } = await axiosClient.get<User[]>(`${usersService.baseUrl}`);
    return data;
  },

  findOne: async (id: string) => {
    const { data } = await axiosClient.get<User>(
      `${usersService.baseUrl}/${id}`,
    );
    return data;
  },

  create: async (user: UserPayload) => {
    const { data } = await axiosClient.post<User>(
      `${usersService.baseUrl}`,
      user,
    );
    return data;
  },

  update: async (id: string, user: UserPayload) => {
    const { data } = await axiosClient.patch<User>(
      `${usersService.baseUrl}/${id}`,
      user,
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await axiosClient.delete<{ message: string }>(
      `${usersService.baseUrl}/${id}`,
    );
    return data;
  },
};
