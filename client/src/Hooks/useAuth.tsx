import axios from "axios";
import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllState,
  signupUser,
  loginUser,
  logoutUser,
} from "../redux/slices/authSlice";
import { LoginFormInput, SignupFormInput } from "../types/forms";

export default function useAuth() {
  const state = useSelector(getAllState);

  const { user } = state;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const cookie = new Cookies();

  const location = useLocation();
  const [params] = useSearchParams();

  const signup = async (formInput: SignupFormInput) => {
    await axios
      .post("/user/signup", formInput)
      .then((response) => {
        const res = response.data;
        if (res) {
          dispatch(signupUser());
          toast.success("You have successfully signed up");
        }
      })
      .catch((error) => {
        const { data = null } = error.response;
        console.log(data);
        if (data.msg) {
          toast.error(data.msg);
        } else {
          toast.error("You were not able to signup");
        }
      });
  };

  const login = async (formInput: LoginFormInput, link: string = null) => {
    const refLink = params.get("refLink") || null;
    console.log(refLink);
    await axios
      .post("/user/login", formInput)
      .then((response) => {
        const res = response.data;
        console.log(res);
        if (res.accessToken) {
          cookie.set("accessToken", res.accessToken, { path: "/" });
        }
        dispatch(loginUser(res));
        toast.success("You have logged in");
        if (refLink) {
          const refPathname = new URL(refLink).pathname;
          navigate(refPathname || "/", { replace: true });
        } else {
          navigate(link || "/", { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);
        const { data = null } = error.response;
        if (data.msg) {
          toast.error(data.msg);
        } else {
          toast.error("Something went wrong. You were no able to login");
        }
      });
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();
  };

  const logout = async (
    options: { customLink?: string; redirect?: boolean } = null
  ) => {
    const { customLink = null, redirect = true } = options || {};

    const { pathname } = location;

    let link = pathname.toString();

    if (pathname.split("/")[1].toString() === "admin" || "user") {
      link =
        pathname.split("/")[1].toString() === "admin"
          ? `/admin`
          : `/user/login`;
    }

    // console.log("link: ", link);
    if (user?.id) {
      await axios
        .post("/user/logout", { id: user.id })
        .then((response) => {
          // const res = response.data;
          // console.log(res);
          cookie.remove("accessToken", { path: "/" });
          dispatch(logoutUser());
          if (redirect) {
            navigate(customLink || link || "/user/login/", {
              replace: true,
              state: { redirect: pathname },
            });
          }
        })
        .catch((error) => {
          // const { data } = error.response;
          // console.log(data);

          toast.error("Something went wrong. You were not able to logout");
        });
    } else {
      cookie.remove("accessToken", { path: "/" });
      if (redirect) {
        navigate(customLink || link || `/user/login/`, { replace: true });
      }
    }
  };

  const verifyToken = async (options: { redirect?: boolean } = null) => {
    const { redirect = true } = options || {};
    const accessToken = cookie.get("accessToken");

    let tokenVerification = false;

    if (accessToken) {
      await axios
        .post("/user/verifyToken", { accessToken })
        .then((response) => {
          // console.log(response);
          const res = response.data;
          // console.log(res);
          if (res.accessToken) {
            cookie.set("accessToken", res.accessToken, { path: "/" });
            tokenVerification = true;
          }
          dispatch(loginUser(res));
        })
        .catch((error) => {
          console.log(error);
          logout({ redirect });
          toast.error("Your Session Expired");
        });
    } else if (user) {
      logout({ redirect });
      toast.error("You Need To Login First");
    }

    return tokenVerification;
  };

  return { ...state, signup, login, logout, verifyToken };
}
