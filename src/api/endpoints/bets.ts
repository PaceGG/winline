import { httpClient } from "../httpClient";
import type { Bet } from "../types/bet";

export const betsAPI = {
  placeBet: (
    betData: Omit<Bet, "id" | "createdAt" | "status">
  ): Promise<{ bet: Bet }> =>
    httpClient.post("/bets", {
      ...betData,
      createdAt: new Date().toISOString(),
      status: "PENDING",
    }),

  getUserBets: (userId: string): Promise<{ bets: Bet[] }> =>
    httpClient.get(`/bets?userId=${userId}`),
};
