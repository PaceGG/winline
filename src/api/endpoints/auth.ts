import { httpClient } from "../httpClient";
import type { User, UserRegisterRequest } from "../types/user";

export const authAPI = {
  register: (
    userRegisterRequest: UserRegisterRequest
  ): Promise<Omit<User, "password">> => {
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
};
