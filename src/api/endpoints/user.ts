import { httpClient } from "../httpClient";

export const userAPI = {
  updateBalance: async (userId: string, amount: number) => {
    const userResponse = await httpClient.get(`users/${userId}`);
    const user = userResponse.data;

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const currentBalance = user.balance;
    const newBalance = currentBalance + amount;

    const updateResponse = await httpClient.patch(`users/${userId}`, {
      balance: newBalance,
    });

    return updateResponse;
  },
};
