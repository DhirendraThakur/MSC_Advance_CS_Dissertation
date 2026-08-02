import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function AdminPage({ currentUser, users, tasks, onLogout }) {
  const aiTasks = tasks.filter((task) => task.aiGenerated).length;
  const adminUsers = users.filter((user) => user.role === "Admin").length;
  const normalUsers = users.filter((user) => user.role === "User").length;

  return (
    <div className="app">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="main">
        <section className="hero admin-hero">
          <div>
            <span className="section-label">Admin control panel</span>

            <h1>Admin Dashboard</h1>

            <p>
              This page demonstrates role-based access and administrative
              monitoring for the task management prototype.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            label="Total Users"
            value={users.length}
            description="Registered prototype users"
            colour="blue"
          />

          <StatCard
            label="Admin Users"
            value={adminUsers}
            description="Users with admin role"
            colour="green"
          />

          <StatCard
            label="Normal Users"
            value={normalUsers}
            description="Users with standard access"
            colour="orange"
          />

          <StatCard
            label="AI Tasks"
            value={aiTasks}
            description="AI-assisted descriptions"
            colour="purple"
          />
        </section>

        <section className="card">
          <h2>Registered Users</h2>

          <div className="admin-table">
            <div className="admin-row admin-row-head">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
            </div>

            {users.map((user) => (
              <div className="admin-row" key={user.id}>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.role}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;