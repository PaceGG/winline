import { useState, useEffect, useMemo } from "react";
import { matchesAPI } from "../api/endpoints/matches";
import type { Match, MatchStatus } from "../api/types/match";
import { SportTypesList } from "./SportTypesList";

interface MatchListProps {
  matchStatus: MatchStatus;
}

const sportTypeNameMap = {
  FOOTBALL: "Футбол",
  BASEBALL: "Бейсбол",
  BASKETBALL: "Баскетбол",
  AMERICAN_FOOTBALL: "Американский футбол",
};

const MatchList = ({ matchStatus }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await matchesAPI.getMatches({ status: matchStatus });
        console.log(response.data);
        setMatches(response.data);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [matchStatus]);

  const sportTypes = useMemo(() => {
    return [...new Set(matches.map((match) => match.sportType))];
  }, [matches]);

  if (loading) return <div>Loading...</div>;

  return (
    <SportTypesList
      sportTypes={sportTypes}
      sportTypeNameMap={sportTypeNameMap}
      matches={matches}
    />
  );
};

export default MatchList;
