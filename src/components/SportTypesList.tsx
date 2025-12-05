import { Stack } from "@mui/material";
import { SportTypeCard } from "./SportTypeCard";
import React from "react";
import type { Match } from "../api/types/match";

interface SportTypesListProps {
  sportTypes: string[];
  sportTypeNameMap: Record<string, string>;
  matches: Match[];
}

export const SportTypesList: React.FC<SportTypesListProps> = ({
  sportTypes,
  sportTypeNameMap,
  matches,
}) => {
  return (
    <Stack gap={0.5} maxWidth={1000} m={"auto"}>
      {sportTypes.map((sportType) => (
        <SportTypeCard
          key={sportType}
          sportType={sportType}
          sportTypeNameMap={sportTypeNameMap}
          matches={matches.filter((match) => match.sportType === sportType)}
        />
      ))}
    </Stack>
  );
};
