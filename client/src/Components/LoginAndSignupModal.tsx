export function LoginAndSignupModalButton({ className }) {
  return (
    <button
      type="button"
      className={className}
      data-bs-toggle="modal"
      data-bs-target="#loginAndSignupModal"
    >
      Signup / Login
    </button>
  );
}
export function LoginAndSignupModal() {
  function toggleLoginAndSignup() {
    document.getElementById("signup").classList.toggle("active");
    document.getElementById("signup").classList.toggle("show");

    document.getElementById("login").classList.toggle("active");
    document.getElementById("login").classList.toggle("show");
  }

  return (
    <div
      className="modal fade"
      id="loginAndSignupModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-body position-relative">
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 mt-3 me-3"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

            {/* <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#login"
                  type="button"
                  role="tab"
                  aria-controls="login"
                  aria-selected="true"
                >
                  Login
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#signup"
                  type="button"
                  role="tab"
                  aria-controls="signup"
                  aria-selected="false"
                >
                  Signup
                </button>
              </li>
            </ul> */}

            <div className="tab-content">
              <div
                className="tab-pane fade active show"
                id="login"
                role="tabpanel"
              >
                <p>Login</p>
                <button
                  className="btn btn-link text-dark text-underline-none"
                  onClick={toggleLoginAndSignup}
                >
                  Signup
                </button>
              </div>
              <div className="tab-pane fade" id="signup" role="tabpanel">
                <p>Signup</p>
                <button
                  className="btn btn-link text-dark text-underline-none"
                  onClick={toggleLoginAndSignup}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
