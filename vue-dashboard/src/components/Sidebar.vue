<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">AI</div>

      <div>
        <h2>TaskFlow AI</h2>
        <p>{{ currentUser.role }} panel</p>
      </div>
    </div>

    <nav>
      <RouterLink to="/dashboard" class="nav-button">Dashboard</RouterLink>
      <RouterLink to="/tasks" class="nav-button">Task Management</RouterLink>
      <RouterLink to="/recommendation" class="nav-button">
        Recommendation Model
      </RouterLink>

      <RouterLink
        v-if="currentUser.role === 'Admin'"
        to="/admin"
        class="nav-button"
      >
        Admin Dashboard
      </RouterLink>
    </nav>

    <div class="research-note">
      <strong>Logged in as</strong>
      <p>{{ currentUser.name }}</p>
      <p>{{ currentUser.email }}</p>

      <button type="button" class="logout-button" @click="$emit('logout')">
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  currentUser: {
    type: Object,
    required: true
  }
});

defineEmits(["logout"]);
</script>