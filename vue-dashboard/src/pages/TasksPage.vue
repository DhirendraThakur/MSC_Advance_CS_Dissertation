<template>
  <div v-if="currentUser" class="app">
    <Sidebar :current-user="currentUser" @logout="handleLogout" />

    <main class="main">
      <section class="layout">
        <form class="card form-card" @submit.prevent="saveTask">
          <h2>{{ editingTaskId ? "Edit Task" : "Create New Task" }}</h2>

          <p v-if="message" class="message">{{ message }}</p>

          <label>Task Title</label>
          <input
            v-model="taskForm.title"
            placeholder="Example: Prepare dissertation implementation chapter"
          />

          <button
            type="button"
            class="ai-button"
            :disabled="aiLoading"
            @click="generateDescription"
          >
            {{
              aiLoading
                ? "Generating Professional Description..."
                : "Generate Professional AI Description"
            }}
          </button>

          <label>Description</label>
          <textarea
            v-model="taskForm.description"
            placeholder="AI-generated or manually written description"
          ></textarea>

          <div class="row">
            <div>
              <label>Priority</label>
              <select v-model="taskForm.priority">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label>Status</label>
              <select v-model="taskForm.status">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <label>Due Date</label>
          <input v-model="taskForm.dueDate" type="date" />

          <div class="actions">
            <button type="submit">
              {{ editingTaskId ? "Update Task" : "Save Task" }}
            </button>

            <button type="button" class="secondary" @click="resetTaskForm">
              Clear
            </button>
          </div>
        </form>

        <section class="card">
          <div class="section-header">
            <div>
              <h2>Task List</h2>

              <p>
                Search, filter, sort, edit, and delete project tasks.
                {{
                  currentUser.role === "Admin"
                    ? "Admin can view all user tasks."
                    : "You can view only your own tasks."
                }}
              </p>
            </div>
          </div>

          <div class="controls">
            <input v-model="search" placeholder="Search tasks..." />

            <select v-model="filterStatus">
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select v-model="sortBy">
              <option value="title">Sort by title</option>
              <option value="dueDate">Sort by due date</option>
              <option value="priority">Sort by priority</option>
            </select>
          </div>

          <p v-if="filteredTasks.length === 0" class="empty-state">
            No tasks found for this account. Create a new task to begin.
          </p>

          <article v-for="task in filteredTasks" :key="task.id" class="task">
            <div>
              <h3>{{ task.title }}</h3>
              <p class="task-description">{{ task.description }}</p>

              <div class="badges">
                <span>{{ task.priority }}</span>
                <span>{{ task.status }}</span>
                <span v-if="currentUser.role === 'Admin'">
                  {{ task.ownerEmail }}
                </span>
                <span v-if="task.aiGenerated">AI Description</span>
              </div>
            </div>

            <div class="task-actions">
              <button type="button" @click="editTask(task)">Edit</button>

              <button
                type="button"
                class="danger"
                @click="deleteTask(task.id)"
              >
                Delete
              </button>
            </div>
          </article>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
import aiService from "../services/aiService";
import authService from "../services/authService";
import taskService from "../services/taskService";

const router = useRouter();

const currentUser = ref(null);
const taskListVersion = ref(0);

const taskForm = ref({
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: ""
});

const search = ref("");
const filterStatus = ref("All");
const sortBy = ref("title");

const editingTaskId = ref(null);
const message = ref("");
const aiLoading = ref(false);

onMounted(() => {
  const user = authService.getCurrentUser();

  if (!user) {
    router.push("/login");
    return;
  }

  currentUser.value = user;
});

const visibleTasks = computed(() => {
  taskListVersion.value;

  if (!currentUser.value) {
    return [];
  }

  return taskService.getVisibleTasks(currentUser.value);
});

const filteredTasks = computed(() => {
  return [...visibleTasks.value]
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.value.toLowerCase());

      const matchesStatus =
        filterStatus.value === "All" || task.status === filterStatus.value;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy.value === "dueDate") {
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      }

      if (sortBy.value === "priority") {
        return a.priority.localeCompare(b.priority);
      }

      return a.title.localeCompare(b.title);
    });
});

function clearTaskForm() {
  taskForm.value = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: ""
  };

  editingTaskId.value = null;
}

function resetTaskForm() {
  clearTaskForm();
  message.value = "";
}

function saveTask() {
  if (!currentUser.value) {
    return;
  }

  if (!taskForm.value.title.trim()) {
    message.value = "Task title is required.";
    return;
  }

  if (!taskForm.value.dueDate) {
    message.value = "Due date is required.";
    return;
  }

  if (editingTaskId.value) {
    const updated = taskService.updateTask(
      currentUser.value,
      editingTaskId.value,
      taskForm.value
    );

    clearTaskForm();
    taskListVersion.value++;

    message.value = updated
      ? "Task updated successfully."
      : "You can only update your own tasks.";

    return;
  }

  taskService.addTask(currentUser.value, taskForm.value);
  clearTaskForm();
  taskListVersion.value++;

  message.value = "Task created successfully.";
}

function editTask(task) {
  if (
    currentUser.value.role !== "Admin" &&
    task.ownerEmail !== currentUser.value.email
  ) {
    message.value = "You can only edit your own tasks.";
    return;
  }

  editingTaskId.value = task.id;

  taskForm.value = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate
  };

  message.value = "Editing selected task.";
}

function deleteTask(taskId) {
  const deleted = taskService.deleteTask(currentUser.value, taskId);

  taskListVersion.value++;

  message.value = deleted
    ? "Task deleted successfully."
    : "You can only delete your own tasks.";
}

async function generateDescription() {
  if (!taskForm.value.title.trim()) {
    message.value = "Enter a task title before generating AI description.";
    return;
  }

  aiLoading.value = true;
  message.value = "Generating professional AI task description...";

  const response = await aiService.generateTaskDescription(taskForm.value);

  taskForm.value.description = response.description;
  message.value = "Professional AI description generated successfully.";
  aiLoading.value = false;
}

function handleLogout() {
  authService.logout();
  router.push("/login");
}
</script>