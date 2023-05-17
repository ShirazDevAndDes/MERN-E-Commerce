import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CartOffCanvas } from "../Components/Cart";
import useAuth from "../Hooks/useAuth";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

export default function ClientLayout() {
  const { verifyToken } = useAuth();

  useEffect(() => {
    verifyToken({ redirect: false });
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Header />
      <Navbar />
      <CartOffCanvas />
      <div className="min-vh-100">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
