import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography as T,
} from "@mui/material";
import type { Match } from "../api/types/match";
import RowStack from "./RowStack";
import CoefsList from "./CoefsList";

interface MatchesBetsListProps {
  matches: Match[];
}

export default function MatchesBetsList({ matches }: MatchesBetsListProps) {
  return (
    <Stack gap={1}>
      {matches.map((match) => (
        <Box key={match.id}>
          <Paper
            sx={{
              bgcolor: "#edf0f5",
              p: 1,
              //   position: "sticky",
              //   top: 120,
              //   zIndex: 9,
            }}
            elevation={0}
          >
            <T>{match.league}</T>
          </Paper>
          <Stack sx={{ p: 1 }}>
            <CoefsList
              teams={[match.teamA, match.teamB]}
              score={[match.scoreA, match.scoreB]}
              odds={match.odds}
              match={match}
            />
            {/* <CoefsList team={match.teamB} odds={match.odds} /> */}
            {/* <T>{match.teamB}</T> */}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
