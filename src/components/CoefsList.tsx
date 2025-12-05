import {
  Box,
  Button,
  Divider,
  Typography as T,
  Menu,
  MenuItem,
} from "@mui/material";
import RowStack from "./RowStack";
import type { Handicap, Odds, Total } from "../api/types/match";
import { useState } from "react";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

interface CoefBoxProps {
  coef?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

function CoefBox({ coef, onClick, isSelected = false }: CoefBoxProps) {
  return (
    <Button
      disabled={!coef}
      disableElevation
      onClick={onClick}
      sx={{
        p: 0,
        width: 50,
        minWidth: 50,
        height: 30,
        borderRadius: 5,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isSelected ? "#1976d2" : "#f0f2f5",
        color: isSelected ? "#fff" : "#222",
        cursor: "pointer",
        ":hover": {
          bgcolor: isSelected ? "#1565c0" : "#e0e4ea",
        },
        fontSize: "0.875rem",
        fontWeight: isSelected ? 600 : 400,
      }}
    >
      {coef ? coef.toFixed(2) : "-"}
    </Button>
  );
}

function CoefBoxPlug() {
  return (
    <RowStack gap={"3px"}>
      <CoefBox />
      <CoefBox />
      <CoefBox />
    </RowStack>
  );
}

interface CoefValueSelectorProps {
  selection: Handicap[] | Total[];
  currentValue: number;
  onChange: (value: number) => void;
  label?: string;
  type: "handicap" | "total";
}

function CoefValueSelector({
  selection,
  currentValue,
  onChange,
  label = "Выбрать",
  type,
}: CoefValueSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: number) => {
    onChange(value);
    handleClose();
  };

  const formatValue = (value: number) => {
    if (type === "handicap") {
      return value > 0 ? `+${value}` : value.toString();
    } else {
      return value.toString();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        disableElevation
        sx={{
          p: 0,
          width: 50,
          minWidth: 50,
          height: 30,
          borderRadius: 5,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#222",
          cursor: "pointer",
          ":hover": {
            bgcolor: "#e0e4ea",
          },
          fontSize: "0.875rem",
          fontWeight: 400,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <span>{formatValue(currentValue)}</span>
        </Box>
        <ArrowBackIosRoundedIcon
          sx={{
            top: -15,
            transform: `rotate(90deg)`,
            color: "#666",
            fontSize: 16,
            transition: "0.2s",
            position: "absolute",
          }}
        />
        <ArrowBackIosRoundedIcon
          sx={{
            bottom: -15,
            transform: `rotate(270deg)`,
            color: "#666",
            fontSize: 16,
            transition: "0.2s",
            position: "absolute",
          }}
        />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            minWidth: 150,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {selection.map((item) => {
          const isHandicap = "oddsA" in item;
          return (
            <MenuItem
              key={item.value}
              onClick={() => handleSelect(item.value)}
              selected={item.value === currentValue}
              sx={{
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {isHandicap && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "0.8rem" }}>
                      {(item as Handicap).oddsA.toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontWeight: item.value === currentValue ? 600 : 400,
                      }}
                    >
                      {formatValue(item.value)}
                    </span>
                    <span style={{ color: "#666", fontSize: "0.8rem" }}>
                      {(item as Handicap).oddsB.toFixed(2)}
                    </span>
                  </Box>
                )}
                {!isHandicap && (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <span style={{ color: "#666", fontSize: "0.8rem" }}>
                      {(item as Total).over.toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontWeight: item.value === currentValue ? 600 : 400,
                      }}
                    >
                      {formatValue(item.value)}
                    </span>
                    <span style={{ color: "#666", fontSize: "0.8rem" }}>
                      {(item as Total).under.toFixed(2)}
                    </span>
                  </Box>
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

interface CoefsListProps {
  teams: string[];
  odds: Odds;
  isTeamA?: boolean;
}

export default function CoefsList({
  teams,
  odds,
  isTeamA = true,
}: CoefsListProps) {
  const [currentHandicapValue, setCurrentHandicapValue] = useState<number>(
    odds.handicap?.[0]?.value ?? 0
  );
  const [currentTotalValue, setCurrentTotalValue] = useState<number>(
    odds.total?.[0]?.value ?? 0
  );

  // Состояния для выбранных коэффициентов
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [selectedHandicap, setSelectedHandicap] = useState<{
    type: "home" | "away";
  } | null>(null);
  const [selectedTotal, setSelectedTotal] = useState<{
    type: "over" | "under";
  } | null>(null);

  // Функции для получения коэффициентов для выбранных значений
  const getHandicapCoef = (forHome: boolean) => {
    if (!odds.handicap || odds.handicap.length === 0) return undefined;
    const handicap = odds.handicap.find(
      (h) => h.value === currentHandicapValue
    );
    if (!handicap) return odds.handicap[0][forHome ? "oddsA" : "oddsB"];
    return handicap[forHome ? "oddsA" : "oddsB"];
  };

  const getTotalCoef = (isOver: boolean) => {
    if (!odds.total || odds.total.length === 0) return undefined;
    const total = odds.total.find((t) => t.value === currentTotalValue);
    if (!total) return odds.total[0][isOver ? "over" : "under"];
    return total[isOver ? "over" : "under"];
  };

  const handleOutcomeClick = (type: "winA" | "draw" | "winB") => {
    // setSelectedOutcome(type);
    console.log(type);
  };

  const handleHandicapClick = (type: "home" | "away") => {
    // setSelectedHandicap({ type });
    console.log({ type });
  };

  const handleTotalClick = (type: "over" | "under") => {
    // setSelectedTotal({ type });
    console.log({ type });
  };

  const isHomeTeam = isTeamA;

  return (
    <Box
      sx={{
        p: 1.5,
      }}
    >
      <RowStack justifyContent="space-between" alignItems="center">
        <T
          variant="body1"
          sx={{
            fontWeight: 500,
            flex: 1,
            fontSize: "0.95rem",
          }}
        >
          {teams[0]}
          <br />
          {teams[1]}
        </T>

        <RowStack gap={2} alignItems="center" sx={{ flexWrap: "nowrap" }}>
          {/* Основные исходы (1X2) */}
          <RowStack gap="3px">
            <CoefBox
              coef={isHomeTeam ? odds.winA : odds.winB}
              onClick={() => handleOutcomeClick(isHomeTeam ? "winA" : "winB")}
              isSelected={selectedOutcome === (isHomeTeam ? "winA" : "winB")}
            />
            <CoefBox
              coef={odds.draw}
              onClick={() => handleOutcomeClick("draw")}
              isSelected={selectedOutcome === "draw"}
            />
            <CoefBox
              coef={isHomeTeam ? odds.winB : odds.winA}
              onClick={() => handleOutcomeClick(isHomeTeam ? "winB" : "winA")}
              isSelected={selectedOutcome === (isHomeTeam ? "winB" : "winA")}
            />
          </RowStack>

          <Divider orientation="vertical" flexItem sx={{ height: 30 }} />

          {/* Фора (Handicap) */}
          {odds.handicap && odds.handicap.length > 0 ? (
            <RowStack gap="3px" alignItems="center">
              <CoefBox
                coef={getHandicapCoef(true)}
                onClick={() => handleHandicapClick("home")}
                isSelected={selectedHandicap?.type === "home"}
              />
              <CoefValueSelector
                selection={odds.handicap}
                currentValue={currentHandicapValue}
                onChange={setCurrentHandicapValue}
                label="Фора"
                type="handicap"
              />
              <CoefBox
                coef={getHandicapCoef(false)}
                onClick={() => handleHandicapClick("away")}
                isSelected={selectedHandicap?.type === "away"}
              />
            </RowStack>
          ) : (
            <CoefBoxPlug />
          )}

          <Divider orientation="vertical" flexItem sx={{ height: 30 }} />

          {/* Тотал (Total) */}
          {odds.total && odds.total.length > 0 ? (
            <RowStack gap="3px" alignItems="center">
              <CoefBox
                coef={getTotalCoef(true)}
                onClick={() => handleTotalClick("over")}
                isSelected={selectedTotal?.type === "over"}
              />
              <CoefValueSelector
                selection={odds.total}
                currentValue={currentTotalValue}
                onChange={setCurrentTotalValue}
                label="Тотал"
                type="total"
              />
              <CoefBox
                coef={getTotalCoef(false)}
                onClick={() => handleTotalClick("under")}
                isSelected={selectedTotal?.type === "under"}
              />
            </RowStack>
          ) : (
            <CoefBoxPlug />
          )}
        </RowStack>
      </RowStack>
    </Box>
  );
}
