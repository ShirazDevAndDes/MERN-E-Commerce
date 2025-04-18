import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function useAuth() {
  const context = useContext(AuthContext);

  const { user, accessToken, isLoggedIn, dispatch } = context;

  const navigate = useNavigate();

  const cookie = new Cookies();

  useEffect(() => {
    console.log("user: ", user);
    if (cookie.get("accessToken")) {
      verifyToken();
    } else {
      if (isLoggedIn) {
        cookie.set("accessToken", accessToken, { path: "/" });
      }
    }

    // eslint-disable-next-line
  }, []);

  const signup = async (formInput) => {
    await axios
      .post("/user/signup", formInput)
      .then((response) => {
        const res = response.data;
        dispatch({ type: "SIGNUP", payload: "" });
      })
      .catch((error) => {
        const { data } = error.response;
        console.log(data);
      });
  };

  const login = async (formInput) => {
    await axios
      .post("/user/login", formInput)
      .then((response) => {
        const res = response.data;
        // dispatch({ type: "LOGOUT", payload: { ...res } });
        console.log(res);
        if (res.accessToken) {
          cookie.set("accessToken", res.accessToken, { path: "/" });
        }
        dispatch({ type: "LOGIN", payload: { ...res } });
      })
      .catch((error) => {
        const { data } = error.response;
        console.log(data);
      });
  };

  const logout = async (link = null) => {
    console.log(link);
    dispatch({ type: "LOGOUT", payload: "" });
    cookie.remove("accessToken");
    // navigate(link || "/", { replace: true });
  };

  const verifyToken = async () => {
    const accessToken = cookie.get("accessToken");

    await axios
      .post("/user/verifyToken", { accessToken })
      .then((response) => {
        const res = response.data;
        console.log(res);
        if (res.accessToken) {
          cookie.set("accessToken", res.accessToken, { path: "/" });
        }
        dispatch({ type: "LOGIN", payload: { ...res } });
      })
      .catch((error) => {
        const { data } = error.response;
        logout();
        console.log(data);
      });
  };

  return { ...context, signup, login, logout, verifyToken };
}
