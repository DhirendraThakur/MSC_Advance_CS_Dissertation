export type UserRole = "Admin" | "User";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Task {
  id: number;
  ownerEmail: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  aiGenerated: boolean;
}

export interface TaskForm {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface AiDescriptionResponse {
  description: string;
  source?: string;
  note?: string;
}