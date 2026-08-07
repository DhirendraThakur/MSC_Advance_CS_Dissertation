import { createRouter, createWebHistory } from "vue-router";

import authService from "../services/authService";

import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import TasksPage from "../pages/TasksPage.vue";
import RecommendationPage from "../pages/RecommendationPage.vue";
import AdminPage from "../pages/AdminPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: LoginPage
  },
  {
    path: "/register",
    component: RegisterPage
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tasks",
    component: TasksPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/recommendation",
    component: RecommendationPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin",
    component: AdminPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const currentUser = authService.getCurrentUser();

  if (to.meta.requiresAuth && !currentUser) {
    return "/login";
  }

  if (to.meta.requiresAdmin && currentUser?.role !== "Admin") {
    return "/dashboard";
  }

  return true;
});

export default router;