import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

function TasksPage({ currentUser, tasks, setTasks, onLogout }) {
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

  const userTasks = useMemo(() => {
    if (currentUser.role === "Admin") {
      return tasks;
    }

    return tasks.filter((task) => task.ownerEmail === currentUser.email);
  }, [tasks, currentUser]);

  const filteredTasks = useMemo(() => {
    return userTasks
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
          return (a.dueDate || "").localeCompare(b.dueDate || "");
        }

        if (sortBy === "priority") {
          return a.priority.localeCompare(b.priority);
        }

        return a.title.localeCompare(b.title);
      });
  }, [userTasks, search, filterStatus, sortBy]);

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
    setMessage("");
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
                ownerEmail: task.ownerEmail || currentUser.email,
                aiGenerated: form.description.trim().length > 0
              }
            : task
        )
      );

      setMessage("Task updated successfully.");
    } else {
      const newTask = {
        id: Date.now(),
        ownerEmail: currentUser.email,
        ...form,
        aiGenerated: form.description.trim().length > 0
      };

      setTasks((previous) => [newTask, ...previous]);
      setMessage("Task created successfully.");
    }

    resetForm();
  }

  function handleEdit(task) {
    if (currentUser.role !== "Admin" && task.ownerEmail !== currentUser.email) {
      setMessage("You can only edit your own tasks.");
      return;
    }

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
    const selectedTask = tasks.find((task) => task.id === id);

    if (
      selectedTask &&
      currentUser.role !== "Admin" &&
      selectedTask.ownerEmail !== currentUser.email
    ) {
      setMessage("You can only delete your own tasks.");
      return;
    }

    setTasks((previous) => previous.filter((task) => task.id !== id));
    setMessage("Task deleted successfully.");
  }

  async function generateDescription() {
    if (!form.title.trim()) {
      setMessage("Enter a task title before generating AI description.");
      return;
    }

    setAiLoading(true);
    setMessage("Generating professional AI task description...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/generate-task-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: form.title,
            priority: form.priority,
            status: form.status,
            dueDate: form.dueDate,
            projectContext:
              "MSc dissertation project involving React, Angular, Vue.js, AI-enhanced task dashboard, secure backend API integration, and intelligent framework recommendation model."
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI generation failed.");
      }

      setForm((previous) => ({
        ...previous,
        description: data.description
      }));

      setMessage("Professional AI description generated successfully.");
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to connect to the AI backend. Please check that the backend server is running."
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="app">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="main">
        <section className="layout">
          <form className="card form-card" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Task" : "Create New Task"}</h2>

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
              disabled={aiLoading}
            >
              {aiLoading
                ? "Generating Professional Description..."
                : "Generate Professional AI Description"}
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

          <section className="card">
            <div className="section-header">
              <div>
                <h2>Task List</h2>
                <p>
                  Search, filter, sort, edit, and delete project tasks.
                  {currentUser.role === "Admin"
                    ? " Admin can view all user tasks."
                    : " You can view only your own tasks."}
                </p>
              </div>
            </div>

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

            {filteredTasks.length === 0 ? (
              <p className="empty-state">
                No tasks found for this account. Create a new task to begin.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <article className="task" key={task.id}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <div className="badges">
                      <span>{task.priority}</span>
                      <span>{task.status}</span>
                      {currentUser.role === "Admin" && task.ownerEmail && (
                        <span>{task.ownerEmail}</span>
                      )}
                      {task.aiGenerated && <span>AI Description</span>}
                    </div>
                  </div>

                  <div className="task-actions">
                    <button type="button" onClick={() => handleEdit(task)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default TasksPage;