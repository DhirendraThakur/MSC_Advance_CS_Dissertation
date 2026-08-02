import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">AI</div>

        <div>
          <h2>TaskFlow AI</h2>
          <p>{currentUser.role} panel</p>
        </div>
      </div>

      <nav>
        <NavLink to="/dashboard" className="nav-button">
          Dashboard
        </NavLink>

        <NavLink to="/tasks" className="nav-button">
          Task Management
        </NavLink>

        <NavLink to="/recommendation" className="nav-button">
          Recommendation Model
        </NavLink>

        {currentUser.role === "Admin" && (
          <NavLink to="/admin" className="nav-button">
            Admin Dashboard
          </NavLink>
        )}
      </nav>

      <div className="research-note">
        <strong>Logged in as</strong>
        <p>{currentUser.name}</p>
        <p>{currentUser.email}</p>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;