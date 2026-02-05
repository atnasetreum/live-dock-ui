import axiosClient from "@/common/axiosClient";
import { User } from "@/types";

export const usersService = {
  findAll: async () => {
    const { data } = await axiosClient.get<User[]>("/users");
    return data;
  },

  findOne: async (id: string) => {
    const { data } = await axiosClient.get<User>(`/users/${id}`);
    return data;
  },

  create: async (user: Partial<User>) => {
    const { data } = await axiosClient.post<User>("/users", user);
    return data;
  },

  update: async (id: string, user: Partial<User>) => {
    const { data } = await axiosClient.put<User>(`/users/${id}`, user);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await axiosClient.delete<{ message: string }>(
      `/users/${id}`,
    );
    return data;
  },
};
