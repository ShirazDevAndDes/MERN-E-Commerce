import { Outlet } from "react-router-dom";
// import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <Header />
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content-section p-0 bg-light">
          <Navbar />
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
