import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function UserLayout() {
  return (
    <div>
      <Header />
      <div className="col-4">
        <Sidebar />
      </div>
      <div className="col-8">
        <Navbar />
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
