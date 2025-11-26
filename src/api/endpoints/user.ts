import { httpClient } from "../httpClient";
import type { UserData } from "../types/user";

export const userAPI = {
  get: async (userId: string): Promise<UserData> => {
    const userResponse = await httpClient.get(`users/${userId}`);
    const user = userResponse.data;

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    return user;
  },

  updateBalance: async (userId: string, amount: number) => {
    const user = await userAPI.get(userId);

    const currentBalance = user.balance;
    const newBalance = currentBalance + amount;

    const updateResponse = await httpClient.patch(`users/${userId}`, {
      balance: newBalance,
    });

    return updateResponse;
  },

  updateLogin: async (userId: string, newLogin: string) => {
    const updateResponse = await httpClient.patch(`users/${userId}`, {
      login: newLogin,
    });

    return updateResponse;
  },
};
