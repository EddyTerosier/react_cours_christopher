import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.status === "succeeded") {
      navigate("/");
    }
  }, [auth.isAuthenticated, auth.status, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">🔑 Sign In</h2>
        <p className="login-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="login-link">
            You don't have account ?{" "}
            <Link to={"/register"} className="unstyled-link">
              Register
            </Link>
          </p>

          {auth.status === "failed" && (
            <div className="text-danger mb-3">
              {auth.error?.message || JSON.stringify(auth.error)}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={auth.status === "loading"}
          >
            {auth.status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
