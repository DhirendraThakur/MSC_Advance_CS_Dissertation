<template>
  <div class="auth-page">
    <div class="auth-left">
      <span class="section-label">Vue.js prototype</span>
      <h1>TaskFlow AI</h1>

      <p>
        AI-enhanced task management dashboard with login, registration,
        role-based access, task handling, backend AI description generation, and
        framework recommendation preview.
      </p>

      <div class="auth-highlight">
        <strong>Prototype purpose</strong>
        <p>
          This Vue.js version reproduces the same requirements as React and
          Angular so implementation differences can be evaluated fairly.
        </p>
      </div>
    </div>

    <div class="auth-card">
      <form @submit.prevent="handleLogin">
        <h2>Login</h2>

        <p class="auth-subtitle">
          Use admin or student credentials to access the Vue.js prototype.
        </p>

        <p v-if="message" class="message">{{ message }}</p>

        <label>Email</label>
        <input v-model="email" placeholder="admin@gmail.com" />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="admin123" />

        <button type="submit">Login</button>

        <p class="switch-auth">
          Do not have an account?
          <RouterLink to="/register">Register</RouterLink>
        </p>

        <div class="demo-box">
          <strong>Demo accounts</strong>
          <span>Admin: admin@gmail.com / admin123</span>
          <span>User: dhiren@gmail.com / dhiren123</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/authService";

const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");

onMounted(() => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return;
  }

  router.push(currentUser.role === "Admin" ? "/admin" : "/dashboard");
});

function handleLogin() {
  const user = authService.login(email.value, password.value);

  if (!user) {
    message.value = "Invalid email or password.";
    return;
  }

  router.push(user.role === "Admin" ? "/admin" : "/dashboard");
}
</script>