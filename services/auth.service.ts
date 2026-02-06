import axiosClient from "@/common/axiosClient";

export const authService = {
  baseUrl: "/auth",
  login: async (
    email: string,
    password: string,
  ): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<{ message: string }>(
      `${authService.baseUrl}/login`,
      {
        email,
        password,
      },
    );
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<{ message: string }>(
      `${authService.baseUrl}/logout`,
    );
    return data;
  },
};
