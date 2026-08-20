import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { saveAuthData } from "../../utils/storage";
import heroImage from "../../assets/hero.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        userId,
        password,
      });

      const token = response.data?.token;

      if (response.status === "success" && token) {
        saveAuthData(token, response.data.user);
        navigate("/dashboard", { replace: true });
        return;
      }

      setError(
        response.message || "Login succeeded without a valid token"
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Invalid User ID or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-visual" aria-label="PrepRoute">
        <div className="visual-grid" />
        <img
          className="visual-art"
          src={heroImage}
          alt=""
        />
      </section>

      <div className="login-card">
        <div className="brand" aria-label="PrepRoute">
          <span className="brand-mark">P</span>
          <span>prepRoute</span>
        </div>

        <h1>Login</h1>

        <p className="login-subtitle">
          Use your company provided Login credentials
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">
              User ID
            </label>

            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              placeholder="Enter User ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter Password"
            />
          </div>

          <button
            className="forgot-password"
            type="button"
            onClick={() => setError("Please contact your administrator to reset your password.")}
          >
            Forgot password?
          </button>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;