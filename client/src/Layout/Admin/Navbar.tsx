import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Navbar() {
  const [menuIconOpen, setMenuIconOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-white mb-3">
      <div className="container">
        <button
          type="button"
          className="btn btn-outline-dark ms-auto"
          onClick={() => {
            setMenuIconOpen(!menuIconOpen);
            if (document.querySelector(".sidebar").classList.contains("show")) {
              document.querySelector(".sidebar").classList.remove("show");
              document
                .querySelector(".content-section")
                .classList.remove("show");
            } else {
              document.querySelector(".sidebar").classList.add("show");
              document.querySelector(".content-section").classList.add("show");
            }
          }}
        >
          {menuIconOpen ? (
            <FontAwesomeIcon icon={faXmark} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>
      </div>
    </nav>
  );
}
