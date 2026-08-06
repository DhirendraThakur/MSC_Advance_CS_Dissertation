import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";

import { Sidebar } from "../../components/sidebar/sidebar";
import { Task, TaskForm, TaskStatus, User } from "../../models/app.models";
import { AiService } from "../../services/ai.service";
import { AuthService } from "../../services/auth.service";
import { TaskService } from "../../services/task.service";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: "./tasks.html"
})
export class Tasks implements OnInit {
  currentUser!: User;

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
  aiLoading = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private aiService: AiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(["/login"]);
      return;
    }

    this.currentUser = user;
  }

  get visibleTasks(): Task[] {
    return this.taskService.getVisibleTasks(this.currentUser);
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

  private clearTaskForm(): void {
    this.taskForm = {
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: ""
    };

    this.editingTaskId = null;
  }

  resetTaskForm(): void {
    this.clearTaskForm();
    this.message = "";
  }

  saveTask(): void {
    if (!this.taskForm.title.trim()) {
      this.message = "Task title is required.";
      return;
    }

    if (!this.taskForm.dueDate) {
      this.message = "Due date is required.";
      return;
    }

    if (this.editingTaskId) {
      const updated = this.taskService.updateTask(
        this.currentUser,
        this.editingTaskId,
        this.taskForm
      );

      this.clearTaskForm();

      this.message = updated
        ? "Task updated successfully."
        : "You can only update your own tasks.";

      return;
    }

    this.taskService.addTask(this.currentUser, this.taskForm);
    this.clearTaskForm();
    this.message = "Task created successfully.";
  }

  editTask(task: Task): void {
    if (
      this.currentUser.role !== "Admin" &&
      task.ownerEmail !== this.currentUser.email
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
    const deleted = this.taskService.deleteTask(this.currentUser, taskId);

    this.message = deleted
      ? "Task deleted successfully."
      : "You can only delete your own tasks.";
  }

  async generateDescription(): Promise<void> {
    if (!this.taskForm.title.trim()) {
      this.message = "Enter a task title before generating AI description.";
      return;
    }

    this.aiLoading = true;
    this.message = "Generating professional AI task description...";

    try {
      const response = await firstValueFrom(
        this.aiService.generateTaskDescription(this.taskForm)
      );

      this.taskForm.description = response.description;
      this.message = "Professional AI description generated successfully.";
    } catch {
      this.message =
        "Unable to connect to the AI backend. Please check that the backend server is running.";
    } finally {
      this.aiLoading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}