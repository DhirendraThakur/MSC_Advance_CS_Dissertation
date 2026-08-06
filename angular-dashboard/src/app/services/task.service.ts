import { Injectable } from "@angular/core";
import { INITIAL_TASKS } from "../data/initial-data";
import { Task, TaskForm, User } from "../models/app.models";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  private readonly tasksKey = "angular_taskflow_tasks";
  private tasks: Task[] = this.loadTasks();

  private loadTasks(): Task[] {
    const storedTasks = localStorage.getItem(this.tasksKey);

    if (!storedTasks) {
      return INITIAL_TASKS;
    }

    try {
      const parsedTasks = JSON.parse(storedTasks) as Task[];

      return parsedTasks.map((task) => ({
        ...task,
        ownerEmail: task.ownerEmail || "dhiren@gmail.com",
        aiGenerated: Boolean(task.aiGenerated)
      }));
    } catch {
      return INITIAL_TASKS;
    }
  }

  private saveTasks(): void {
    localStorage.setItem(this.tasksKey, JSON.stringify(this.tasks));
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getVisibleTasks(user: User): Task[] {
    if (user.role === "Admin") {
      return [...this.tasks];
    }

    return this.tasks.filter((task) => task.ownerEmail === user.email);
  }

  addTask(user: User, form: TaskForm): void {
    const newTask: Task = {
      id: Date.now(),
      ownerEmail: user.email,
      ...form,
      aiGenerated: form.description.trim().length > 0
    };

    this.tasks = [newTask, ...this.tasks];
    this.saveTasks();
  }

  updateTask(user: User, taskId: number, form: TaskForm): boolean {
    const selectedTask = this.tasks.find((task) => task.id === taskId);

    if (!selectedTask) {
      return false;
    }

    if (user.role !== "Admin" && selectedTask.ownerEmail !== user.email) {
      return false;
    }

    this.tasks = this.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...form,
            ownerEmail: task.ownerEmail || user.email,
            aiGenerated: form.description.trim().length > 0
          }
        : task
    );

    this.saveTasks();
    return true;
  }

  deleteTask(user: User, taskId: number): boolean {
    const selectedTask = this.tasks.find((task) => task.id === taskId);

    if (!selectedTask) {
      return false;
    }

    if (user.role !== "Admin" && selectedTask.ownerEmail !== user.email) {
      return false;
    }

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();

    return true;
  }
}