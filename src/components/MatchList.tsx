import { useState, useEffect } from "react";
import { matchesAPI } from "../api/endpoints/matches";
import type { Match } from "../api/types/match";

const MatchList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await matchesAPI.getMatches({ status: "UPCOMING" });
        console.log(response.data);
        setMatches(response.data);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          <h3>
            {match.teamA} vs {match.teamB}
          </h3>
          <div>
            Коэффициенты: П1 - {match.odds.winA}, Х - {match.odds.draw}, П2 -{" "}
            {match.odds.winB}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
