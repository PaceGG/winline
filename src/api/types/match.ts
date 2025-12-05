export type MatchStatus = "UPCOMING" | "LIVE" | "FINISHED" | "CANCELLED";

export type Handicap = { value: number; oddsA: number; oddsB: number };
export type Total = { value: number; over: number; under: number };

export type Odds = {
  winA: number;
  draw: number;
  winB: number;
  handicap?: Handicap[];
  total?: Total[];
};

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  sportType: string;
  league: string;
  startTime: string;
  status: MatchStatus;
  scoreA: number | null;
  scoreB: number | null;
  odds: Odds;
}
