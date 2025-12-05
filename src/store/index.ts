// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./userAuthSlice";
import userReducer from "./userSlice";
import filtersReducer from "./filtersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
