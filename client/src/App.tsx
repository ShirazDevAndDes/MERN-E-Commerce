import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import Checkout from "./Pages/Checkout";
import ClientLayout from "./Layout/ClientLayout";
// import UserLayout from "./Layout/User/UserLayout";
import AdminLayout from "./Layout/Admin/AdminLayout";
import UserLogin from "./Pages/user/UserLogin";
import UserSignup from "./Pages/user/UserSignup";
import AdminLogin from "./Pages/admin/AdminLogin";
import NoPage from "./Pages/NoPage";
import AdminCategories from "./Pages/admin/AdminCategories";
import AdminProducts from "./Pages/admin/AdminProducts";
import Products from "./Pages/Products";
import ProtectedRoutes from "./Pages/ProtectedRoutes";
import CheckoutResult from "./Pages/CheckoutResult";
import AdminBanners from "./Pages/admin/AdminBanners";
import Orders from "./Pages/user/Orders";

import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import AdminOrders from "./Pages/admin/AdminOrders";

library.add(far, fas);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/checkout/:type/:id" element={<CheckoutResult />} />
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<Product />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoutes protectionFor={"admin"}>
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={""} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="banners" element={<AdminBanners />} />
        </Route>
        <Route
          path="/user/*"
          element={
            <ProtectedRoutes protectionFor={"user"}>
              <ClientLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="orders" element={<Orders />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route path="*" element={<ClientLayout />}>
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route index element={<NoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
