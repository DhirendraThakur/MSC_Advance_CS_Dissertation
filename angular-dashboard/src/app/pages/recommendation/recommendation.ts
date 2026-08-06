import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sidebar } from "../../components/sidebar/sidebar";
import { User } from "../../models/app.models";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-recommendation",
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: "./recommendation.html"
})
export class Recommendation implements OnInit {
  currentUser!: User;

  constructor(
    private authService: AuthService,
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}