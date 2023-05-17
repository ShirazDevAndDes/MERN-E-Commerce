import { createContext, useEffect, useMemo, useReducer } from "react";
import { Cookies } from "react-cookie";

const initialValue = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
};

const AuthReducer = (state, action) => {
  const { user, accessToken } = action.payload;

  switch (action.type) {
    case "SIGNUP":
      return initialValue;
    case "LOGIN":
      return { user, accessToken, isLoggedIn: true };
    case "LOGOUT":
      return initialValue;
    default:
      return initialValue;
  }
};

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialValue);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
