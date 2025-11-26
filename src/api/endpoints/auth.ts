import { httpClient } from "../httpClient";
import type {
  User,
  UserData,
  UserLoginRequest,
  UserRegisterRequest,
} from "../types/user";

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await httpClient.get(`users?email=${email}`);
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const authAPI = {
  register: async (
    userRegisterRequest: UserRegisterRequest
  ): Promise<UserData> => {
    const emailExists = await checkEmailExists(userRegisterRequest.email);
    if (emailExists) {
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

    const userData: Omit<User, "id"> = {
      login: userRegisterRequest.login,
      email: userRegisterRequest.email,
      password: userRegisterRequest.password,
      balance: 0,
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date(),
    };

    const response = await httpClient.post("users", userData);
    const { password, ...userWithoutPassword } = response.data;
    return userWithoutPassword;
  },

  login: async (data: UserLoginRequest): Promise<UserData> => {
    const response = await httpClient.get(
      `users?email=${data.email}&password=${data.password}`
    );

    if (response.data.length === 0) {
      throw {
        response: {
          status: 401,
          data: {
            message: "Invalid credentials",
            code: "AUTH_FAILED",
          },
        },
      };
    }

    const userData = response.data[0];
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  },
};
