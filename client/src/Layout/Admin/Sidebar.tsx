import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column h-100">
      <ul className="nav flex-column">
        <Link className="nav-item btn text-start" to={"/admin/banners"}>
          Banners
        </Link>
        <Link className="nav-item btn text-start" to={"/admin/categories"}>
          Categories
        </Link>
        <Link className="nav-item btn text-start" to={"/admin/products"}>
          Products
        </Link>
      </ul>

      <div className="dropdown open mt-auto">
        <button
          className="btn btn-secondary dropdown-toggle w-100"
          type="button"
          id="triggerId"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {`${user.firstName} ${user.lastName}`}
        </button>
        <div className="dropdown-menu w-100" aria-labelledby="triggerId">
          <button
            className="dropdown-item text-bg-danger"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
