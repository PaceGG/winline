import { httpClient } from "../httpClient";
import type { User, UserData } from "../types/user";

export const userAPI = {
  get: async (userId: string): Promise<User> => {
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

  updateEmail: async (userId: string, newEmail: string) => {
    const newEmailUser = await httpClient.get(`users?email=${newEmail}`);
    if (newEmailUser.data.length > 0) {
      throw {
        response: {
          status: 409,
          data: {
            message: "Пользователь с таким email уже существует",
            code: "EMAIL_EXISTS",
          },
        },
      };
    }

    const updateResponse = await httpClient.patch(`users/${userId}`, {
      email: newEmail,
    });

    return updateResponse;
  },

  updatePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const user = await userAPI.get(userId);
    if (user.password !== oldPassword) {
      throw {
        response: {
          status: 400,
          data: {
            message: "Старый пароль указан неверно",
            code: "INVALID_PASSWORD",
          },
        },
      };
    }

    const updateResponse = await httpClient.patch(`users/${userId}`, {
      password: newPassword,
    });

    return updateResponse;
  },
};
