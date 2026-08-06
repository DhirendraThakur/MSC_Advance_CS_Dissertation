import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Sidebar } from "../../components/sidebar/sidebar";
import { User } from "../../models/app.models";
import { AuthService } from "../../services/auth.service";
import { TaskService } from "../../services/task.service";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: "./admin.html"
})
export class Admin implements OnInit {
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

    if (user.role !== "Admin") {
      this.router.navigate(["/dashboard"]);
      return;
    }

    this.currentUser = user;
  }

  get users(): User[] {
    return this.authService.getUsers();
  }

  get totalTasks(): number {
    return this.taskService.getAllTasks().length;
  }

  get adminUsers(): number {
    return this.authService.getAdminUserCount();
  }

  get normalUsers(): number {
    return this.authService.getNormalUserCount();
  }

  get aiTasks(): number {
    return this.taskService
      .getAllTasks()
      .filter((task) => task.aiGenerated).length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}