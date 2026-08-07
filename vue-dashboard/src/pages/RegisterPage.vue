<template>
  <div class="auth-page">
    <div class="auth-left">
      <span class="section-label">Create account</span>
      <h1>Register</h1>

      <p>
        The register page is separated from the login page to create a cleaner
        and more professional Vue.js project structure.
      </p>

      <div class="auth-highlight">
        <strong>Research relevance</strong>
        <p>
          Registration supports evaluation of form validation, state handling,
          user roles, and future backend authentication integration.
        </p>
      </div>
    </div>

    <div class="auth-card">
      <form @submit.prevent="handleRegister">
        <h2>Create Account</h2>

        <p class="auth-subtitle">
          Create a prototype account for dashboard access.
        </p>

        <p v-if="message" class="message">{{ message }}</p>

        <label>Full Name</label>
        <input v-model="name" placeholder="Enter full name" />

        <label>Email</label>
        <input v-model="email" placeholder="Enter email address" />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="Create password" />

        <label>Role</label>
        <select v-model="role">
          <option>User</option>
          <option>Admin</option>
        </select>

        <button type="submit">Create Account</button>

        <p class="switch-auth">
          Already have an account?
          <RouterLink to="/login">Login</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/authService";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("User");
const message = ref("");

function handleRegister() {
  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    message.value = "All registration fields are required.";
    return;
  }

  const result = authService.register({
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value
  });

  if (!result.success) {
    message.value = result.message;
    return;
  }

  router.push("/login");
}
</script>