import { initialTasks } from "../data/initialData";

const TASKS_KEY = "vue_taskflow_tasks";

function loadTasks() {
  const storedTasks = localStorage.getItem(TASKS_KEY);

  if (!storedTasks) {
    return initialTasks;
  }

  try {
    const parsedTasks = JSON.parse(storedTasks);

    return parsedTasks.map((task) => ({
      ...task,
      ownerEmail: task.ownerEmail || "dhiren@gmail.com",
      aiGenerated: Boolean(task.aiGenerated)
    }));
  } catch {
    return initialTasks;
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

const taskService = {
  getAllTasks() {
    return [...tasks];
  },

  getVisibleTasks(user) {
    if (user.role === "Admin") {
      return [...tasks];
    }

    return tasks.filter((task) => task.ownerEmail === user.email);
  },

  addTask(user, form) {
    const newTask = {
      id: Date.now(),
      ownerEmail: user.email,
      ...form,
      aiGenerated: form.description.trim().length > 0
    };

    tasks = [newTask, ...tasks];
    saveTasks();
  },

  updateTask(user, taskId, form) {
    const selectedTask = tasks.find((task) => task.id === taskId);

    if (!selectedTask) {
      return false;
    }

    if (user.role !== "Admin" && selectedTask.ownerEmail !== user.email) {
      return false;
    }

    tasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...form,
            ownerEmail: task.ownerEmail || user.email,
            aiGenerated: form.description.trim().length > 0
          }
        : task
    );

    saveTasks();
    return true;
  },

  deleteTask(user, taskId) {
    const selectedTask = tasks.find((task) => task.id === taskId);

    if (!selectedTask) {
      return false;
    }

    if (user.role !== "Admin" && selectedTask.ownerEmail !== user.email) {
      return false;
    }

    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();

    return true;
  }
};

export default taskService;