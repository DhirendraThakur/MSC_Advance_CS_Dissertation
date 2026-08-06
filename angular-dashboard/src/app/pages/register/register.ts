import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { UserRole } from "../../models/app.models";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./register.html"
})
export class Register {
  name = "";
  email = "";
  password = "";
  role: UserRole = "User";
  message = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.message = "All registration fields are required.";
      return;
    }

    const result = this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    });

    if (!result.success) {
      this.message = result.message;
      return;
    }

    this.router.navigate(["/login"]);
  }
}