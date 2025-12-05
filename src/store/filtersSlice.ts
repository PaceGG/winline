import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  selectedSportsArray: string[]; // Храним как массив
}

const initialState: FilterState = {
  selectedSportsArray: [], // Начальное состояние - пустой массив
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleSportFilter: (state, action: PayloadAction<string>) => {
      const sportType = action.payload;
      const index = state.selectedSportsArray.indexOf(sportType);

      if (index === -1) {
        // Добавляем, если нет
        state.selectedSportsArray.push(sportType);
      } else {
        // Удаляем, если есть
        state.selectedSportsArray.splice(index, 1);
      }
    },

    setSportFilters: (state, action: PayloadAction<string[]>) => {
      state.selectedSportsArray = action.payload;
    },

    clearSportFilters: (state) => {
      state.selectedSportsArray = [];
    },
  },
});

// Селекторы
export const selectSelectedSportsArray = (state: { filters: FilterState }) =>
  state.filters.selectedSportsArray;

// Селектор, который возвращает Set (создаем на лету)
export const selectSelectedSportsSet = (state: { filters: FilterState }) =>
  new Set(state.filters.selectedSportsArray);

export const { toggleSportFilter, setSportFilters, clearSportFilters } =
  filterSlice.actions;

export default filterSlice.reducer;
