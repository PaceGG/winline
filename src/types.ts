export type UserRole = "USER" | "ADMIN" | "SUPPORT" | "GUEST";

export interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  role: UserRole;
  isBlocked: boolean;
  createdAt: Date;
}
