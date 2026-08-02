import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterPage({ users, setUsers }) {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setRegisterForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleRegister(event) {
    event.preventDefault();

    if (
      !registerForm.name.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password.trim()
    ) {
      setMessage("All registration fields are required.");
      return;
    }

    const emailExists = users.some((user) => user.email === registerForm.email);

    if (emailExists) {
      setMessage("This email is already registered.");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...registerForm
    };

    setUsers((previous) => [...previous, newUser]);
    navigate("/login");
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <span className="section-label">Create account</span>
        <h1>Register</h1>

        <p>
          The register page is separated from the login page to create a cleaner
          and more professional React project structure.
        </p>

        <div className="auth-highlight">
          <strong>Research relevance</strong>

          <p>
            Registration supports evaluation of form validation, state handling,
            user roles, and future backend authentication integration.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <form onSubmit={handleRegister}>
          <h2>Create Account</h2>

          <p className="auth-subtitle">
            Create a prototype account for the dashboard.
          </p>

          {message && <p className="message">{message}</p>}

          <label>Full Name</label>
          <input
            name="name"
            value={registerForm.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />

          <label>Email</label>
          <input
            name="email"
            value={registerForm.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={registerForm.password}
            onChange={handleChange}
            placeholder="Create password"
          />

          <label>Role</label>
          <select
            name="role"
            value={registerForm.role}
            onChange={handleChange}
          >
            <option>User</option>
            <option>Admin</option>
          </select>

          <button type="submit">Create Account</button>

          <p className="switch-auth">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;