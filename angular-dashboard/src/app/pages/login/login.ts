import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./login.html"
})
export class Login implements OnInit {
  email = "";
  password = "";
  message = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    if (currentUser.role === "Admin") {
      this.router.navigate(["/admin"]);
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }

  login(): void {
    const user = this.authService.login(this.email, this.password);

    if (!user) {
      this.message = "Invalid email or password.";
      return;
    }

    if (user.role === "Admin") {
      this.router.navigate(["/admin"]);
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }
}