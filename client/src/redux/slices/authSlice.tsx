import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialStateType } from "../../types/redux/slices/auth";

const initialState: InitialStateType = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupUser: () => {},
    loginUser: (
      state,
      action: PayloadAction<Omit<InitialStateType, "isLoggedIn">>
    ): void => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isLoggedIn = true;
    },
    logoutUser: () => initialState,
  },
});

export const { signupUser, loginUser, logoutUser } = authSlice.actions;

export const getAllState = (state: { auth: InitialStateType }) => state.auth;
export const getUser = (state: { auth: Pick<InitialStateType, "user"> }) =>
  state.auth.user;
export const getAccessToken = (state: {
  auth: Pick<InitialStateType, "accessToken">;
}) => state.auth.accessToken;
export const getLoginStatus = (state: {
  auth: Pick<InitialStateType, "isLoggedIn">;
}) => state.auth.isLoggedIn;

export default authSlice.reducer;
