import { Link, useLocation } from "react-router-dom";
import { CartButton } from "../Components/Cart";
import useAuth from "../Hooks/useAuth";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const { pathname } = useLocation();

  return (
    <nav className="navbar sticky-top navbar-expand-sm navbar-light bg-white shadow-sm z-index-5">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Navbar
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/" aria-current="page">
                Home <span className="visually-hidden">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
          </ul>
          {/* <form className="d-flex my-2 my-lg-0">
            <input
              className="form-control me-sm-2"
              type="text"
              placeholder="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form> */}

          {isLoggedIn && user.role === "user" ? (
            <div className="dropdown me-3">
              <button
                className="btn btn-outline-dark dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                {user.firstName + " " + user.lastName}
              </button>
              <div className="dropdown-menu">
                <Link to={"/user/orders"} className="dropdown-item">
                  Orders
                </Link>
                <button
                  className="dropdown-item text-bg-danger"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="btn-group me-3">
              <Link
                to={"/user/signup"}
                className="btn btn-outline-dark border-end-0 pe-1"
                style={{
                  borderTopLeftRadius: "2rem",
                  borderBottomLeftRadius: "2rem",
                }}
              >
                Signup
              </Link>
              <button
                type="button"
                className="btn text-dark bg-transparent px-0 fs-4 d-flex align-items-center border-dark border-start-0 border-end-0"
              >
                <span className="vr"></span>
              </button>
              <Link
                to={"/user/login"}
                state={{ redirect: pathname }}
                className="btn btn-outline-dark border-start-0 ps-1"
                style={{
                  borderTopRightRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                }}
              >
                Login
              </Link>
            </div>
          )}
          <CartButton className={"btn rounded-circle pt-2 border-dark"} />
        </div>
      </div>
    </nav>
  );
}
