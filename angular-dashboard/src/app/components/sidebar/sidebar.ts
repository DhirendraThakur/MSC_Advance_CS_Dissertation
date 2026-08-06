import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { User } from "../../models/app.models";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.html"
})
export class Sidebar {
  @Input({ required: true }) currentUser!: User;
  @Output() logout = new EventEmitter<void>();

  handleLogout(): void {
    this.logout.emit();
  }
}