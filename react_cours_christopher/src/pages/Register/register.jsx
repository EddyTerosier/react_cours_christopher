import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(register({ email, password }));
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">📝 Create Account</h2>
        <p className="register-subtitle">Join us and start your journey!</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="yourname@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Choose a password"
            />
          </div>
          <p className="register-login-link">
            You already have an account ?{" "}
            <Link to={"/login"} className="unstyled-link">
              Login
            </Link>
          </p>

          <button
            className="register-button"
            type="submit"
            disabled={auth.status === "loading"}
          >
            {auth.status === "loading" ? "Registering..." : "Register"}
          </button>
        </form>

        {auth.status === "failed" && (
          <p className="error-message">
            {auth.error?.message || JSON.stringify(auth.error)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
