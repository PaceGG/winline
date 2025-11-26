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
    setUser: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
