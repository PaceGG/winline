import {
  Paper,
  Box,
  Typography,
  type SxProps,
  Divider,
  Collapse,
} from "@mui/material";
import React, { useState } from "react";
import RowStack from "./RowStack";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import type { Match } from "../api/types/match";
import MatchesBetsList from "./MatchesBetsList";

interface SportTypeCardProps {
  sportType: string;
  sportTypeNameMap: Record<string, string>;
  matches: Match[];
}

const typographySx: SxProps = {
  width: 50,
  textAlign: "center",
  fontSize: 12,
};

const headerSx: SxProps = {
  textAlign: "center",
  fontSize: 10,
  color: "#444",
};

export const SportTypeCard: React.FC<SportTypeCardProps> = ({
  sportType,
  sportTypeNameMap,
  matches,
}) => {
  const [isMatchesOpen, setIsMatchesOpen] = useState(true);

  return (
    <Paper
      key={sportType}
      sx={{
        p: 0,
        mb: 2,
        overflow: "visible",
      }}
    >
      <Box sx={{ position: "relative", height: "auto" }}>
        <Box
          sx={{
            position: "sticky",
            top: 60,
            zIndex: 10,
            backgroundColor: "background.paper",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomLeftRadius: isMatchesOpen ? "0px" : "5px",
            borderBottomRightRadius: isMatchesOpen ? "0px" : "5px",
            borderBottom: "1px solid",
            borderColor: "divider",
            justifyContent: "space-between",
            cursor: "pointer",
            p: 1,
            display: "flex",
            transition: "0.2s",
          }}
          onClick={() => setIsMatchesOpen(!isMatchesOpen)}
        >
          <Typography variant="h6">
            {sportTypeNameMap[sportType] ?? sportType}
          </Typography>
          <RowStack sx={{ userSelect: "none" }}>
            <Box>
              <Typography sx={headerSx}>Исход</Typography>
              <RowStack gap={"3px"}>
                <Typography sx={typographySx}>1</Typography>
                <Typography sx={typographySx}>x</Typography>
                <Typography sx={typographySx}>2</Typography>
              </RowStack>
            </Box>
            <Divider orientation="vertical" />
            <Box>
              <Typography sx={headerSx}>Фора</Typography>
              <RowStack gap={"3px"}>
                <Typography sx={typographySx}>1</Typography>
                <Typography sx={typographySx}>x</Typography>
                <Typography sx={typographySx}>2</Typography>
              </RowStack>
            </Box>
            <Divider orientation="vertical" />
            <Box>
              <Typography sx={headerSx}>Тотал</Typography>
              <RowStack gap={"3px"}>
                <Typography sx={typographySx}>М</Typography>
                <Typography sx={typographySx}>x</Typography>
                <Typography sx={typographySx}>Б</Typography>
              </RowStack>
            </Box>
            <ArrowBackIosRoundedIcon
              sx={{
                transform: `rotate(${isMatchesOpen ? "90" : "270"}deg)`,
                color: "#666",
                fontSize: 16,
                transition: "0.2s",
              }}
            />
          </RowStack>
        </Box>
        <Collapse in={isMatchesOpen}>
          <Box sx={{ p: 2 }}>
            <MatchesBetsList matches={matches} />
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};
