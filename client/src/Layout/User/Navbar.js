import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-sm navbar-light bg-white">
      <div class="container">
        <button
          class="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
          <ul class="navbar-nav me-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <Link class="nav-link active" to="#" aria-current="page">
                Home <span class="visually-hidden">(current)</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="#">
                Link
              </Link>
            </li>
            <li class="nav-item dropdown">
              <Link
                class="nav-link dropdown-toggle"
                to="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Dropdown
              </Link>
              <div class="dropdown-menu" aria-labelledby="dropdownId">
                <Link class="dropdown-item" to="#">
                  Action 1
                </Link>
                <Link class="dropdown-item" to="#">
                  Action 2
                </Link>
              </div>
            </li>
          </ul>
          <form class="d-flex my-2 my-lg-0">
            <input
              class="form-control me-sm-2"
              type="text"
              placeholder="Search"
            />
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
