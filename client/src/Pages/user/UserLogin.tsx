import { useState } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../Components/SEO";
import useAuth from "../../Hooks/useAuth";
import {
  HTMLFormSubmitType,
  HTMLInputEventType,
  LoginFormInput,
} from "../../types/forms";

export default function UserLogin() {
  const [formInput, setFormInput] = useState<LoginFormInput>({
    email: "",
    password: "",
    role: "user",
  });

  const { state } = useLocation();

  const { login } = useAuth();

  function handleInput(e: HTMLInputEventType) {
    const { name, value } = e.target;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  function handleSubmit(e: HTMLFormSubmitType) {
    e.preventDefault();

    if (state) {
      login(formInput, state.redirect);
    } else {
      login(formInput);
    }
  }

  return (
    <>
      <SEO title="User | Login" noIndex={true} />

      <div className="container-fluid bg-light">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="card shadow col-12 col-md-6 col-lg-3">
            <div className="card-body">
              <h4 className="display-4 text-center mb-3">Login</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control shadow-sm border-light"
                    name="email"
                    placeholder="Enter Email"
                    onChange={handleInput}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control shadow-sm border-light"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleInput}
                  />
                </div>
                <button type="submit" className="btn btn-dark rounded-0 w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
