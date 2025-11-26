export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  amount: number;
  potentialWin: number;
  status: "PENDING" | "WON" | "LOST" | "CANCELED";
  odds: number;
  type: "WIN_A" | "DRAW" | "WIN_B" | "HANDICAP" | "TOTAL";
  subType: string | null;
  matchSnapshot: {
    teamA: string;
    teamB: string;
    startTime: Date;
  };
}
