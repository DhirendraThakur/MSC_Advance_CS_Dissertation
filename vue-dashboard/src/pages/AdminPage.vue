<template>
  <div v-if="currentUser" class="app">
    <Sidebar :current-user="currentUser" @logout="handleLogout" />

    <main class="main">
      <section class="admin-page">
        <section class="hero admin-hero">
          <div>
            <span class="section-label">Admin control panel</span>
            <h1>Admin Dashboard</h1>

            <p>
              This page demonstrates role-based access and administrative
              monitoring for the Vue.js task management prototype.
            </p>
          </div>
        </section>

        <section class="stats-grid">
          <div class="card stat-card blue">
            <span>Total Users</span>
            <strong>{{ users.length }}</strong>
            <small>Registered prototype users</small>
          </div>

          <div class="card stat-card green">
            <span>Admin Users</span>
            <strong>{{ adminUsers }}</strong>
            <small>Users with admin role</small>
          </div>

          <div class="card stat-card orange">
            <span>Normal Users</span>
            <strong>{{ normalUsers }}</strong>
            <small>Users with standard access</small>
          </div>

          <div class="card stat-card purple">
            <span>AI Tasks</span>
            <strong>{{ aiTasks }}</strong>
            <small>AI-assisted descriptions</small>
          </div>
        </section>

        <section class="card">
          <h2>Registered Users</h2>

          <div class="admin-table">
            <div class="admin-row admin-row-head">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
            </div>

            <div
              v-for="registeredUser in users"
              :key="registeredUser.id"
              class="admin-row"
            >
              <span>{{ registeredUser.name }}</span>
              <span>{{ registeredUser.email }}</span>
              <span>{{ registeredUser.role }}</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
import authService from "../services/authService";
import taskService from "../services/taskService";

const router = useRouter();
const currentUser = ref(null);

onMounted(() => {
  const user = authService.getCurrentUser();

  if (!user) {
    router.push("/login");
    return;
  }

  if (user.role !== "Admin") {
    router.push("/dashboard");
    return;
  }

  currentUser.value = user;
});

const users = computed(() => authService.getUsers());
const adminUsers = computed(() => authService.getAdminUserCount());
const normalUsers = computed(() => authService.getNormalUserCount());

const aiTasks = computed(
  () => taskService.getAllTasks().filter((task) => task.aiGenerated).length
);

function handleLogout() {
  authService.logout();
  router.push("/login");
}
</script>