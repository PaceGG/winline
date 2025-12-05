import { useState, useEffect, useMemo } from "react";
import { matchesAPI } from "../api/endpoints/matches";
import type { Match, MatchStatus } from "../api/types/match";
import { SportTypesList } from "./SportTypesList";
import { Box } from "@mui/material";
import SportTypesFilter from "./SportTypesFilter";
import { useAppSelector } from "../hooks/redux";

interface MatchListProps {
  matchStatus: MatchStatus;
}

const sportTypeNameMap: Record<string, string> = {
  FOOTBALL: "Футбол",
  BASEBALL: "Бейсбол",
  BASKETBALL: "Баскетбол",
  AMERICAN_FOOTBALL: "Американский футбол",
};

const MatchList = ({ matchStatus }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Используем селектор для получения Set
  const sportFiltersSet = useAppSelector(
    (state) => state.filters.selectedSportsArray
  );

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await matchesAPI.getMatches({ status: matchStatus });
        setMatches(response.data);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [matchStatus]);

  const allSportTypes = useMemo(() => {
    return [...new Set(matches.map((match) => match.sportType))];
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (sportFiltersSet.length === 0) {
      return matches;
    }

    return matches.filter((match) => sportFiltersSet.includes(match.sportType));
  }, [matches, sportFiltersSet]);

  const filteredSportTypes = useMemo(() => {
    if (sportFiltersSet.length === 0) {
      return allSportTypes;
    }

    return allSportTypes.filter((sportType) =>
      sportFiltersSet.includes(sportType)
    );
  }, [allSportTypes, sportFiltersSet]);

  if (loading) return <div>Loading...</div>;

  const hasMatches = filteredMatches.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        gap: 2,
        p: 2,
      }}
    >
      <SportTypesFilter
        allSports={allSportTypes}
        sportTypeNameMap={sportTypeNameMap}
      />

      {hasMatches ? (
        <SportTypesList
          sportTypes={filteredSportTypes}
          sportTypeNameMap={sportTypeNameMap}
          matches={filteredMatches}
        />
      ) : (
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            color: "text.secondary",
          }}
        >
          {sportFiltersSet.length > 0
            ? "Нет матчей по выбранным фильтрам"
            : "Нет доступных матчей"}
        </Box>
      )}
    </Box>
  );
};

export default MatchList;
