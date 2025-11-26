import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "user" | "none";

interface AuthState {
  role: UserRole;
}

const initialState: AuthState = {
  role: "none",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;

export default authSlice.reducer;
