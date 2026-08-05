import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

type UserRole = "Admin" | "User";
type TaskPriority = "High" | "Medium" | "Low";
type TaskStatus = "Pending" | "In Progress" | "Completed";
type ActivePage = "dashboard" | "tasks" | "recommendation" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface Task {
  id: number;
  ownerEmail: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  aiGenerated: boolean;
}

interface TaskForm {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "Admin"
  },
  {
    id: 2,
    name: "Dhirendra Thakur",
    email: "dhiren@gmail.com",
    password: "dhiren123",
    role: "User"
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    ownerEmail: "dhiren@gmail.com",
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
    ownerEmail: "dhiren@gmail.com",
    title: "Build Angular prototype",
    description:
      "Implement the AI-enhanced task dashboard using Angular with the same functional requirements as React.",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-08-08",
    aiGenerated: false
  },
  {
    id: 3,
    ownerEmail: "admin@gmail.com",
    title: "Design recommendation model",
    description:
      "Create weighted scoring and rule-based explanation for framework selection.",
    priority: "High",
    status: "Completed",
    dueDate: "2026-08-10",
    aiGenerated: false
  }
];

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./app.html",
  styleUrl: "./app.css"
})
export class App implements OnInit {
  users: User[] = [];
  tasks: Task[] = [];
  currentUser: User | null = null;

  authMode: "login" | "register" = "login";
  activePage: ActivePage = "dashboard";

  loginForm = {
    email: "",
    password: ""
  };

  registerForm: Omit<User, "id"> = {
    name: "",
    email: "",
    password: "",
    role: "User"
  };

  taskForm: TaskForm = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: ""
  };

  search = "";
  filterStatus: "All" | TaskStatus = "All";
  sortBy: "title" | "dueDate" | "priority" = "title";

  editingTaskId: number | null = null;
  message = "";
  authMessage = "";
  aiLoading = false;

  ngOnInit(): void {
    this.users = this.loadFromStorage<User[]>(
      "angular_taskflow_users",
      INITIAL_USERS
    );

    this.tasks = this.loadFromStorage<Task[]>(
      "angular_taskflow_tasks",
      INITIAL_TASKS
    );

    this.currentUser = this.loadFromStorage<User | null>(
      "angular_taskflow_current_user",
      null
    );

    if (this.currentUser) {
      this.activePage = this.currentUser.role === "Admin" ? "admin" : "dashboard";
    }
  }

  loadFromStorage<T>(key: string, fallback: T): T {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return fallback;
    }
  }

  saveUsers(): void {
    localStorage.setItem("angular_taskflow_users", JSON.stringify(this.users));
  }

  saveTasks(): void {
    localStorage.setItem("angular_taskflow_tasks", JSON.stringify(this.tasks));
  }

  saveCurrentUser(): void {
    if (this.currentUser) {
      localStorage.setItem(
        "angular_taskflow_current_user",
        JSON.stringify(this.currentUser)
      );
    } else {
      localStorage.removeItem("angular_taskflow_current_user");
    }
  }

  setAuthMode(mode: "login" | "register"): void {
    this.authMode = mode;
    this.authMessage = "";
  }

  login(): void {
    const foundUser = this.users.find(
      (user) =>
        user.email === this.loginForm.email &&
        user.password === this.loginForm.password
    );

    if (!foundUser) {
      this.authMessage = "Invalid email or password.";
      return;
    }

    this.currentUser = foundUser;
    this.saveCurrentUser();

    this.activePage = foundUser.role === "Admin" ? "admin" : "dashboard";
    this.authMessage = "";
  }

  register(): void {
    if (
      !this.registerForm.name.trim() ||
      !this.registerForm.email.trim() ||
      !this.registerForm.password.trim()
    ) {
      this.authMessage = "All registration fields are required.";
      return;
    }

    const emailExists = this.users.some(
      (user) => user.email === this.registerForm.email
    );

    if (emailExists) {
      this.authMessage = "This email is already registered.";
      return;
    }

    const newUser: User = {
      id: Date.now(),
      ...this.registerForm
    };

    this.users = [...this.users, newUser];
    this.saveUsers();

    this.registerForm = {
      name: "",
      email: "",
      password: "",
      role: "User"
    };

    this.authMessage = "Registration successful. Please login.";
    this.authMode = "login";
  }

  logout(): void {
    this.currentUser = null;
    this.loginForm = {
      email: "",
      password: ""
    };
    this.saveCurrentUser();
    this.authMode = "login";
  }

  setActivePage(page: ActivePage): void {
    this.activePage = page;
    this.message = "";
  }

  get visibleTasks(): Task[] {
    if (!this.currentUser) {
      return [];
    }

    if (this.currentUser.role === "Admin") {
      return this.tasks;
    }

    return this.tasks.filter(
      (task) => task.ownerEmail === this.currentUser?.email
    );
  }

  get filteredTasks(): Task[] {
    return [...this.visibleTasks]
      .filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(this.search.toLowerCase());

        const matchesStatus =
          this.filterStatus === "All" || task.status === this.filterStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (this.sortBy === "dueDate") {
          return (a.dueDate || "").localeCompare(b.dueDate || "");
        }

        if (this.sortBy === "priority") {
          return a.priority.localeCompare(b.priority);
        }

        return a.title.localeCompare(b.title);
      });
  }

  get totalTasks(): number {
    return this.visibleTasks.length;
  }

  get completedTasks(): number {
    return this.visibleTasks.filter((task) => task.status === "Completed")
      .length;
  }

  get pendingTasks(): number {
    return this.visibleTasks.filter((task) => task.status === "Pending").length;
  }

  get inProgressTasks(): number {
    return this.visibleTasks.filter((task) => task.status === "In Progress")
      .length;
  }

  get aiTasks(): number {
    return this.visibleTasks.filter((task) => task.aiGenerated).length;
  }

  get highPriorityTasks(): number {
    return this.visibleTasks.filter((task) => task.priority === "High").length;
  }

  get completionRate(): number {
    if (this.totalTasks === 0) {
      return 0;
    }

    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  get adminUsers(): number {
    return this.users.filter((user) => user.role === "Admin").length;
  }

  get normalUsers(): number {
    return this.users.filter((user) => user.role === "User").length;
  }

  resetTaskForm(): void {
    this.taskForm = {
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: ""
    };

    this.editingTaskId = null;
  }

  saveTask(): void {
    if (!this.currentUser) {
      return;
    }

    if (!this.taskForm.title.trim()) {
      this.message = "Task title is required.";
      return;
    }

    if (!this.taskForm.dueDate) {
      this.message = "Due date is required.";
      return;
    }

    if (this.editingTaskId) {
      this.tasks = this.tasks.map((task) =>
        task.id === this.editingTaskId
          ? {
              ...task,
              ...this.taskForm,
              ownerEmail: task.ownerEmail || this.currentUser?.email || "",
              aiGenerated: this.taskForm.description.trim().length > 0
            }
          : task
      );

      this.message = "Task updated successfully.";
    } else {
      const newTask: Task = {
        id: Date.now(),
        ownerEmail: this.currentUser.email,
        ...this.taskForm,
        aiGenerated: this.taskForm.description.trim().length > 0
      };

      this.tasks = [newTask, ...this.tasks];
      this.message = "Task created successfully.";
    }

    this.saveTasks();
    this.resetTaskForm();
  }

  editTask(task: Task): void {
    if (
      this.currentUser?.role !== "Admin" &&
      task.ownerEmail !== this.currentUser?.email
    ) {
      this.message = "You can only edit your own tasks.";
      return;
    }

    this.editingTaskId = task.id;

    this.taskForm = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    };

    this.message = "Editing selected task.";
  }

  deleteTask(taskId: number): void {
    const selectedTask = this.tasks.find((task) => task.id === taskId);

    if (
      selectedTask &&
      this.currentUser?.role !== "Admin" &&
      selectedTask.ownerEmail !== this.currentUser?.email
    ) {
      this.message = "You can only delete your own tasks.";
      return;
    }

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();
    this.message = "Task deleted successfully.";
  }

  async generateDescription(): Promise<void> {
    if (!this.taskForm.title.trim()) {
      this.message = "Enter a task title before generating AI description.";
      return;
    }

    this.aiLoading = true;
    this.message = "Generating professional AI task description...";

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/generate-task-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: this.taskForm.title,
            priority: this.taskForm.priority,
            status: this.taskForm.status,
            dueDate: this.taskForm.dueDate,
            projectContext:
              "MSc dissertation project involving React, Angular, Vue.js, AI-enhanced task dashboard, secure backend API integration, and intelligent framework recommendation model."
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI generation failed.");
      }

      this.taskForm.description = data.description;
      this.message = "Professional AI description generated successfully.";
    } catch (error) {
      this.message =
        error instanceof Error
          ? error.message
          : "Unable to connect to the AI backend. Please check that the backend server is running.";
    } finally {
      this.aiLoading = false;
    }
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}