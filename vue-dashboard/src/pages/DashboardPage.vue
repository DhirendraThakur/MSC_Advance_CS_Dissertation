<template>
  <div v-if="currentUser" class="app">
    <Sidebar :current-user="currentUser" @logout="handleLogout" />

    <main class="main">
      <section class="hero">
        <div>
          <span class="section-label">Dissertation prototype</span>
          <h1>AI-Enhanced Task Management Dashboard</h1>

          <p>
            Vue.js implementation used to evaluate task management
            functionality, AI integration complexity, role-based access, and
            framework suitability.
          </p>
        </div>

        <div class="hero-panel">
          <span>Completion rate</span>
          <strong>{{ completionRate }}%</strong>

          <div class="progress-track">
            <div :style="{ width: completionRate + '%' }"></div>
          </div>
        </div>
      </section>

      <section class="stats-grid">
        <div class="card stat-card blue">
          <span>Total Tasks</span>
          <strong>{{ totalTasks }}</strong>
          <small>Visible tasks for this account</small>
        </div>

        <div class="card stat-card green">
          <span>Completed</span>
          <strong>{{ completedTasks }}</strong>
          <small>Finished work items</small>
        </div>

        <div class="card stat-card orange">
          <span>In Progress</span>
          <strong>{{ inProgressTasks }}</strong>
          <small>Currently active</small>
        </div>

        <div class="card stat-card purple">
          <span>AI Generated</span>
          <strong>{{ aiTasks }}</strong>
          <small>AI-assisted descriptions</small>
        </div>
      </section>

      <section class="insight-grid">
        <div class="card insight-card">
          <h2>Dashboard Summary</h2>

          <p>
            This Vue.js dashboard records task progress and supports
            AI-generated task descriptions through the same backend API used by
            the React and Angular prototypes.
          </p>

          <div class="summary-list">
            <div>
              <span>Pending tasks</span>
              <strong>{{ pendingTasks }}</strong>
            </div>

            <div>
              <span>High priority</span>
              <strong>{{ highPriorityTasks }}</strong>
            </div>

            <div>
              <span>Framework</span>
              <strong>Vue.js</strong>
            </div>
          </div>
        </div>

        <div class="card insight-card">
          <h2>Evaluation Evidence</h2>

          <p>
            This prototype supports comparison of Vue.js against React and
            Angular using the same functional requirements and backend AI
            service.
          </p>

          <ul class="evidence-list">
            <li>Component-based page structure</li>
            <li>Reactive state using Composition API</li>
            <li>Backend AI API communication</li>
            <li>Role-based task visibility</li>
          </ul>
        </div>
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

  currentUser.value = user;
});

const visibleTasks = computed(() => {
  if (!currentUser.value) {
    return [];
  }

  return taskService.getVisibleTasks(currentUser.value);
});

const totalTasks = computed(() => visibleTasks.value.length);

const completedTasks = computed(
  () => visibleTasks.value.filter((task) => task.status === "Completed").length
);

const pendingTasks = computed(
  () => visibleTasks.value.filter((task) => task.status === "Pending").length
);

const inProgressTasks = computed(
  () =>
    visibleTasks.value.filter((task) => task.status === "In Progress").length
);

const aiTasks = computed(
  () => visibleTasks.value.filter((task) => task.aiGenerated).length
);

const highPriorityTasks = computed(
  () => visibleTasks.value.filter((task) => task.priority === "High").length
);

const completionRate = computed(() => {
  if (totalTasks.value === 0) {
    return 0;
  }

  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

function handleLogout() {
  authService.logout();
  router.push("/login");
}
</script>