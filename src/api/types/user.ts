export interface UserRegisterRequest {
  login: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  login: string;
  email: string;
  password: string;
  balance: number;
  role: "USER" | "ADMIN" | "SUPPORT" | "NONE";
  status: "ACTIVE" | "BLOCKED";
  createdAt: Date;
}
