import { useState } from "react";
import SEO from "../../Components/SEO";
import useAuth from "../../Hooks/useAuth";
import {
  HTMLFormSubmitType,
  HTMLInputEventType,
  SignupFormInput,
} from "../../types/forms";

export default function UserSignup() {
  const [formInput, setFormInput] = useState<SignupFormInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const { signup } = useAuth();

  function handleInput(e: HTMLInputEventType) {
    const { name, value } = e.target;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  function handleSubmit(e: HTMLFormSubmitType) {
    e.preventDefault();

    signup(formInput);
  }

  return (
    <>
      <SEO title="User | Signup" noIndex={true} />
      <div className="container-fluid bg-light">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="card col-12 col-md-6 col-lg-3">
            <div className="card-body">
              <h4 className="display-4 text-center mb-3">Sign Up</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                  <label className="form-label">Full Name</label>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="First Name"
                      onChange={handleInput}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleInput}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter Email"
                    onChange={handleInput}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleInput}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  SignUp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
