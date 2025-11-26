import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../api/types/user";

interface UserState {
  user: UserData | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
