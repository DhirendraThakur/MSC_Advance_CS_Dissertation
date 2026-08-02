import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage({ users, setCurrentUser }) {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setLoginForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleLogin(event) {
    event.preventDefault();

    const foundUser = users.find(
      (user) =>
        user.email === loginForm.email && user.password === loginForm.password
    );

    if (!foundUser) {
      setMessage("Invalid email or password.");
      return;
    }

    setCurrentUser(foundUser);

    if (foundUser.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <span className="section-label">React prototype</span>
        <h1>TaskFlow AI</h1>

        <p>
          AI-enhanced task management dashboard with role-based access, task
          handling, AI description generation, and framework recommendation
          preview.
        </p>

        <div className="auth-highlight">
          <strong>Prototype purpose</strong>

          <p>
            This authentication flow helps compare how React, Angular, and
            Vue.js support form handling, state management, routing logic, and
            role-based interface design.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <p className="auth-subtitle">
            Use admin or student credentials to access the prototype.
          </p>

          {message && <p className="message">{message}</p>}

          <label>Email</label>
          <input
            name="email"
            value={loginForm.email}
            onChange={handleChange}
            placeholder="admin@taskflow.ai"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
            placeholder="admin123"
          />

          <button type="submit">Login</button>

          <p className="switch-auth">
            Do not have an account? <Link to="/register">Register</Link>
          </p>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <span>Admin: admin@gmail.com / admin123</span>
            <span>User: student@gmail.com / student123</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;