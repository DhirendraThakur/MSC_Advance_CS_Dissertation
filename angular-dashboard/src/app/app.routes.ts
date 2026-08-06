import { inject } from "@angular/core";
import { CanActivateFn, Router, Routes } from "@angular/router";

import { AuthService } from "./services/auth.service";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Tasks } from "./pages/tasks/tasks";
import { Recommendation } from "./pages/recommendation/recommendation";
import { Admin } from "./pages/admin/admin";

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentUser()) {
    return true;
  }

  return router.createUrlTree(["/login"]);
};

const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.createUrlTree(["/login"]);
  }

  if (currentUser.role !== "Admin") {
    return router.createUrlTree(["/dashboard"]);
  }

  return true;
};

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: Login
  },
  {
    path: "register",
    component: Register
  },
  {
    path: "dashboard",
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: "tasks",
    component: Tasks,
    canActivate: [authGuard]
  },
  {
    path: "recommendation",
    component: Recommendation,
    canActivate: [authGuard]
  },
  {
    path: "admin",
    component: Admin,
    canActivate: [adminGuard]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];