import { useState } from "react";
import SEO from "../../Components/SEO";
import useAuth from "../../Hooks/useAuth";
import {
  HTMLFormSubmitType,
  HTMLInputEventType,
  LoginFormInput,
} from "../../types/forms";

export default function AdminLogin() {
  const [formInput, setFormInput] = useState<LoginFormInput>({
    email: "",
    password: "",
    role: "admin",
  });

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

    login(formInput, "/admin/products");
  }

  return (
    <>
      <SEO title="Admin | Login" noIndex={true} />

      <div className="container-fluid">
        <div className="row bg-light min-vh-100 justify-content-center align-items-center">
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
                <button type="submit" className="btn btn-primary">
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
