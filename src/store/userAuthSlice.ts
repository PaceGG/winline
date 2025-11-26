import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  role: "user" | null;
}

const initialState: AuthState = {
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string | null>) => {
      const newRole = action.payload;

      if (newRole === "user") state.role = newRole;
      else state.role = null;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
