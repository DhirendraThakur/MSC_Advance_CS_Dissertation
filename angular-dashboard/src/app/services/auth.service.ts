import { Injectable } from "@angular/core";
import { INITIAL_USERS } from "../data/initial-data";
import { User } from "../models/app.models";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly usersKey = "angular_taskflow_users";
  private readonly currentUserKey = "angular_taskflow_current_user";

  private users: User[] = this.loadUsers();
  private currentUser: User | null = this.loadCurrentUser();

  private loadUsers(): User[] {
    const storedUsers = localStorage.getItem(this.usersKey);

    if (!storedUsers) {
      return INITIAL_USERS;
    }

    try {
      return JSON.parse(storedUsers) as User[];
    } catch {
      return INITIAL_USERS;
    }
  }

  private loadCurrentUser(): User | null {
    const storedUser = localStorage.getItem(this.currentUserKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  }

  private saveUsers(): void {
    localStorage.setItem(this.usersKey, JSON.stringify(this.users));
  }

  private saveCurrentUser(): void {
    if (this.currentUser) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(this.currentUserKey);
    }
  }

  getUsers(): User[] {
    return [...this.users];
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  login(email: string, password: string): User | null {
    const foundUser = this.users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      return null;
    }

    this.currentUser = foundUser;
    this.saveCurrentUser();

    return foundUser;
  }

  register(userData: Omit<User, "id">): { success: boolean; message: string } {
    const emailExists = this.users.some((user) => user.email === userData.email);

    if (emailExists) {
      return {
        success: false,
        message: "This email is already registered."
      };
    }

    const newUser: User = {
      id: Date.now(),
      ...userData
    };

    this.users = [...this.users, newUser];
    this.saveUsers();

    return {
      success: true,
      message: "Registration successful. Please login."
    };
  }

  logout(): void {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  getAdminUserCount(): number {
    return this.users.filter((user) => user.role === "Admin").length;
  }

  getNormalUserCount(): number {
    return this.users.filter((user) => user.role === "User").length;
  }
}