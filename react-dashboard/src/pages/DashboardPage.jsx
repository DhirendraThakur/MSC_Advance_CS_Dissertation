import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function DashboardPage({ currentUser, tasks, onLogout }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const aiTasks = tasks.filter((task) => task.aiGenerated).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="app">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="main">
        <section className="hero">
          <div>
            <span className="section-label">Dissertation prototype</span>
            <h1>AI-Enhanced Task Management Dashboard</h1>

            <p>
              A React-based implementation used to evaluate task management
              functionality, AI integration complexity, and framework
              suitability.
            </p>
          </div>

          <div className="hero-panel">
            <span>Completion rate</span>
            <strong>{completionRate}%</strong>

            <div className="progress-track">
              <div style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            label="Total Tasks"
            value={totalTasks}
            description="All recorded tasks"
            colour="blue"
          />

          <StatCard
            label="Completed"
            value={completedTasks}
            description="Finished work items"
            colour="green"
          />

          <StatCard
            label="In Progress"
            value={inProgressTasks}
            description="Currently active"
            colour="orange"
          />

          <StatCard
            label="AI Generated"
            value={aiTasks}
            description="AI-assisted descriptions"
            colour="purple"
          />
        </section>

        <section className="insight-grid">
          <div className="card insight-card">
            <h2>Dashboard Summary</h2>

            <p>
              This dashboard records task progress and supports AI-generated
              task descriptions. The same application will later be reproduced
              in Angular and Vue.js to support fair comparison.
            </p>

            <div className="summary-list">
              <div>
                <span>Pending tasks</span>
                <strong>{pendingTasks}</strong>
              </div>

              <div>
                <span>High priority</span>
                <strong>{highPriorityTasks}</strong>
              </div>

              <div>
                <span>Framework</span>
                <strong>React</strong>
              </div>
            </div>
          </div>

          <div className="card insight-card">
            <h2>Evaluation Evidence</h2>

            <p>
              During implementation, evidence such as setup time, code
              structure, development effort, AI integration steps, and UI
              behaviour will be recorded for dissertation evaluation.
            </p>

            <ul className="evidence-list">
              <li>Performance and responsiveness</li>
              <li>Maintainability and component structure</li>
              <li>AI integration complexity</li>
              <li>Developer productivity</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;