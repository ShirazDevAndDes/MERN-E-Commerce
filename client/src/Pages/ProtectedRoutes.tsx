import { useEffect, useState } from "react";
// import { Cookies } from "react-cookie";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import useAuth from "../Hooks/useAuth";

export default function ProtectedRoutes({ children, protectionFor }) {
  const { user, isLoggedIn, logout, verifyToken } = useAuth();

  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // const cookie = new Cookies();

  const pathType = location.pathname.split("/")[1].toString();

  useEffect(() => {
    if (user) {
      verifyToken().then((res) => {
        // console.log(res);
        if (res) {
          setLoading(false);
        }
      });
    } else {
      logout();
    }

    // eslint-disable-next-line
  }, [location]);

  if (loading) {
    return <Loading type={"screen"} />;
  }

  if (!loading && isLoggedIn) {
    if (user.role === protectionFor) {
      return <>{children}</>;
    } else {
      switch (pathType) {
        case "admin":
          toast.error("You are not an admin");
          break;
        case "user":
          toast.error("You are not a user");
          break;

        default:
          break;
      }

      return <Navigate to={"/"} />;
    }
  }

  return <></>;
}
