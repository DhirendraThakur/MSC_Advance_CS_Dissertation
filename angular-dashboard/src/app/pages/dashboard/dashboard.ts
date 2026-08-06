import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sidebar } from "../../components/sidebar/sidebar";
import { User } from "../../models/app.models";
import { AuthService } from "../../services/auth.service";
import { TaskService } from "../../services/task.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: "./dashboard.html"
})
export class Dashboard implements OnInit {
  currentUser!: User;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
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

  get visibleTasks() {
    return this.taskService.getVisibleTasks(this.currentUser);
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}