import { useMemo, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Write methodology chapter",
    description:
      "Prepare research design, data collection, evaluation strategy, and ethical considerations.",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-08-05",
    aiGenerated: true
  },
  {
    id: 2,
    title: "Build React prototype",
    description: "Implement the AI-enhanced task dashboard using React.",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-08-08",
    aiGenerated: false
  },
  {
    id: 3,
    title: "Design recommendation model",
    description:
      "Create weighted scoring and rule-based explanation for framework selection.",
    priority: "High",
    status: "Completed",
    dueDate: "2026-08-10",
    aiGenerated: false
  }
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: ""
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [editingId, setEditingId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          filterStatus === "All" || task.status === filterStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "dueDate") {
          return a.dueDate.localeCompare(b.dueDate);
        }

        if (sortBy === "priority") {
          return a.priority.localeCompare(b.priority);
        }

        return a.title.localeCompare(b.title);
      });
  }, [tasks, search, filterStatus, sortBy]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const aiTasks = tasks.filter((task) => task.aiGenerated).length;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: ""
    });

    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Task title is required.");
      return;
    }

    if (!form.dueDate) {
      setMessage("Due date is required.");
      return;
    }

    if (editingId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                ...form,
                aiGenerated: form.description.trim().length > 0
              }
            : task
        )
      );

      setMessage("Task updated successfully.");
    } else {
      const newTask = {
        id: Date.now(),
        ...form,
        aiGenerated: form.description.trim().length > 0
      };

      setTasks((previous) => [newTask, ...previous]);
      setMessage("Task created successfully.");
    }

    resetForm();
  }

  function handleEdit(task) {
    setEditingId(task.id);

    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    });

    setMessage("Editing selected task.");
  }

  function handleDelete(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setMessage("Task deleted successfully.");
  }

  function generateDescription() {
    if (!form.title.trim()) {
      setMessage("Enter a task title before generating AI description.");
      return;
    }

    setAiLoading(true);
    setMessage("Generating AI description...");

    setTimeout(() => {
      const aiDescription = `This task involves completing "${form.title}" by planning the work, identifying key requirements, carrying out the implementation, and reviewing the final outcome.`;

      setForm((previous) => ({
        ...previous,
        description: aiDescription
      }));

      setAiLoading(false);
      setMessage("AI description generated successfully.");
    }, 900);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>TaskFlow AI</h2>
        <p>React Prototype</p>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#tasks">Tasks</a>
          <a href="#recommendation">Recommendation Model</a>
        </nav>
      </aside>

      <main className="main">
        <section id="dashboard" className="hero">
          <div>
            <h1>AI-Enhanced Task Management Dashboard</h1>
            <p>
              React implementation for evaluating framework suitability and AI
              integration complexity.
            </p>
          </div>

          <span className="tag">Dissertation Prototype</span>
        </section>

        <section className="stats-grid">
          <div className="card stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="card stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="card stat-card">
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="card stat-card">
            <span>AI Generated</span>
            <strong>{aiTasks}</strong>
          </div>
        </section>

        <section className="layout">
          <form className="card form-card" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Task" : "Create Task"}</h2>

            {message && <p className="message">{message}</p>}

            <label>Task Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Prepare dissertation implementation chapter"
            />

            <button
              type="button"
              className="ai-button"
              onClick={generateDescription}
            >
              {aiLoading ? "Generating..." : "Generate AI Description"}
            </button>

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="AI-generated or manually written description"
            />

            <div className="row">
              <div>
                <label>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />

            <div className="actions">
              <button type="submit">
                {editingId ? "Update Task" : "Save Task"}
              </button>

              <button type="button" className="secondary" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>

          <section id="tasks" className="card">
            <h2>Task List</h2>

            <div className="controls">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
              />

              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="title">Sort by title</option>
                <option value="dueDate">Sort by due date</option>
                <option value="priority">Sort by priority</option>
              </select>
            </div>

            {filteredTasks.map((task) => (
              <article className="task" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>

                  <div className="badges">
                    <span>{task.priority}</span>
                    <span>{task.status}</span>
                    {task.aiGenerated && <span>AI Description</span>}
                  </div>
                </div>

                <div className="task-actions">
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </section>

        <section id="recommendation" className="card recommendation">
          <h2>Framework Recommendation Model Preview</h2>

          <p>
            This part will later use evaluation evidence from React, Angular,
            and Vue.js to recommend the most suitable framework based on project
            requirements.
          </p>

          <div className="score">
            <span>Angular</span>
            <div>
              <strong style={{ width: "84%" }}></strong>
            </div>
            <b>84%</b>
          </div>

          <div className="score">
            <span>React</span>
            <div>
              <strong style={{ width: "76%" }}></strong>
            </div>
            <b>76%</b>
          </div>

          <div className="score">
            <span>Vue.js</span>
            <div>
              <strong style={{ width: "71%" }}></strong>
            </div>
            <b>71%</b>
          </div>

          <p className="explanation">
            Example explanation: Angular is recommended where maintainability,
            scalability, security, and structured development are high
            priorities.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;