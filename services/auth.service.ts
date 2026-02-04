import axiosClient from "@/common/axiosClient";

export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<{ message: string }>(
      "/auth/login",
      {
        email,
        password,
      },
    );
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<{ message: string }>(
      "/auth/logout",
    );
    return data;
  },
};
