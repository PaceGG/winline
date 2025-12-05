import React from "react";
import { Box, Chip, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearSportFilters, toggleSportFilter } from "../store/filtersSlice";

interface SportTypesFilterProps {
  allSports: string[];
  sportTypeNameMap: Record<string, string>;
}

const SportTypesFilter: React.FC<SportTypesFilterProps> = ({
  allSports,
  sportTypeNameMap,
}) => {
  const dispatch = useAppDispatch();

  // Получаем массив выбранных фильтров
  const selectedSportsArray = useAppSelector(
    (state) => state.filters.selectedSportsArray
  );

  // Создаем Set для быстрой проверки
  const selectedSportsSet = React.useMemo(
    () => new Set(selectedSportsArray),
    [selectedSportsArray]
  );

  const handleSportClick = (sportType: string) => {
    dispatch(toggleSportFilter(sportType));
  };

  const handleClearFilters = () => {
    dispatch(clearSportFilters());
  };

  const isSelected = (sportType: string) => {
    return selectedSportsSet.has(sportType);
  };

  const isAllSelected = selectedSportsArray.length === 0;

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
        <Chip
          label="Все"
          onClick={handleClearFilters}
          color={isAllSelected ? "primary" : "default"}
          variant={isAllSelected ? "filled" : "outlined"}
          clickable
        />

        {allSports.map((sportType) => (
          <Chip
            key={sportType}
            label={sportTypeNameMap[sportType] || sportType}
            onClick={() => handleSportClick(sportType)}
            color={isSelected(sportType) ? "primary" : "default"}
            variant={isSelected(sportType) ? "filled" : "outlined"}
            clickable
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SportTypesFilter;
