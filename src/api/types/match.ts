export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  sportType: string;
  league: string;
  startTime: string;
  status: "UPCOMING" | "LIVE" | "FINISHED" | "CANCELLED";
  scoreA: number | null;
  scoreB: number | null;
  odds: {
    winA: number;
    draw: number;
    winB: number;
    handicap?: { value: number; oddsA: number; oddsB: number }[];
    total?: { value: number; over: number; under: number }[];
  };
}
