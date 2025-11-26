import { httpClient } from "../httpClient";
import type {
  User,
  UserData,
  UserLoginRequest,
  UserRegisterRequest,
} from "../types/user";

export const authAPI = {
  register: async (
    userRegisterRequest: UserRegisterRequest
  ): Promise<UserData> => {
    const userData: Omit<User, "id"> = {
      login: userRegisterRequest.login,
      email: userRegisterRequest.email,
      password: userRegisterRequest.password,
      balance: 0,
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date(),
    };
    return httpClient.post("users", userData);
  },

  login: async (data: UserLoginRequest): Promise<UserData> => {
    const response = await httpClient.get(
      `users?email=${data.email}&password=${data.password}`
    );

    if (response.data.length === 0) {
      throw new Error("Invalid credentials");
    }

    const userData = response.data[0];
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  },
};
