import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import { initialTasks, initialUsers } from "./data/initialData";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import RecommendationPage from "./pages/RecommendationPage";
import AdminPage from "./pages/AdminPage";

function loadFromStorage(key, fallbackData) {
  const storedData = localStorage.getItem(key);

  if (!storedData) {
    return fallbackData;
  }

  try {
    return JSON.parse(storedData);
  } catch {
    return fallbackData;
  }
}

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [users, setUsers] = useState(() =>
    loadFromStorage("taskflow_users", initialUsers)
  );

  const [tasks, setTasks] = useState(() =>
    loadFromStorage("taskflow_tasks", initialTasks)
  );

  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage("taskflow_current_user", null)
  );

  useEffect(() => {
    localStorage.setItem("taskflow_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("taskflow_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("taskflow_current_user");
    }
  }, [currentUser]);

  function handleLogout() {
    setCurrentUser(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage users={users} setCurrentUser={setCurrentUser} />
          }
        />

        <Route
          path="/register"
          element={<RegisterPage users={users} setUsers={setUsers} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <DashboardPage
                currentUser={currentUser}
                tasks={tasks}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <TasksPage
                currentUser={currentUser}
                tasks={tasks}
                setTasks={setTasks}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendation"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <RecommendationPage
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute currentUser={currentUser}>
              <AdminPage
                currentUser={currentUser}
                users={users}
                tasks={tasks}
                onLogout={handleLogout}
              />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;