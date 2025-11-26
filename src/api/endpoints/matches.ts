import { httpClient } from "../httpClient";
import type { Match } from "../types/match";

export const matchesAPI = {
  getMatches: (filters?: any): Promise<{ data: Match[] }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return httpClient.get(`/matches?${params}`);
  },

  getMatch: (id: string): Promise<{ data: Match }> =>
    httpClient.get(`/matches/${id}`),

  updateMatchOdds: (id: string, odds: any) =>
    httpClient.patch(`/matches/${id}`, { odds }),
};
