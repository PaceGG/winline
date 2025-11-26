import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../api/types/user";

interface UserState {
  user: UserData | null;
}

const USER_STORAGE_KEY = "user";

const getInitialUserState = (): UserData | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

const initialState: UserState = {
  user: getInitialUserState(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;

      try {
        if (action.payload) {
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(action.payload)
          );
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    },
    clearUser: (state) => {
      state.user = null;

      try {
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing user from localStorage:", error);
      }
    },
    syncUserFromStorage: (state) => {
      state.user = getInitialUserState();
    },
  },
});

export const createUserStorageMiddleware =
  () => (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    if (typeof window !== "undefined") {
      const handleStorageChange = (event: StorageEvent) => {
        if (
          event.key === USER_STORAGE_KEY &&
          event.newValue !== event.oldValue
        ) {
          try {
            const userData = event.newValue ? JSON.parse(event.newValue) : null;
            store.dispatch(userSlice.actions.setUser(userData));
          } catch (error) {
            console.error("Error syncing user from storage event:", error);
          }
        }
      };

      window.addEventListener("storage", handleStorageChange);
    }

    return result;
  };

export const { setUser, clearUser, syncUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
