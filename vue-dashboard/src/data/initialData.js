export const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "Admin"
  },
  {
    id: 2,
    name: "Dhirendra Thakur",
    email: "dhiren@gmail.com",
    password: "dhiren123",
    role: "User"
  }
];

export const initialTasks = [
  {
    id: 1,
    ownerEmail: "dhiren@gmail.com",
    title: "Write methodology chapter",
    description:
      "Prepare research design, data collection, evaluation strategy, and ethical considerations.",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-08-05",
    aiGenerated: true
  },
  {
    id: 2,
    ownerEmail: "dhiren@gmail.com",
    title: "Build Vue prototype",
    description:
      "Implement the AI-enhanced task dashboard using Vue.js with the same functional requirements as React and Angular.",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-08-08",
    aiGenerated: false
  },
  {
    id: 3,
    ownerEmail: "admin@gmail.com",
    title: "Design recommendation model",
    description:
      "Create weighted scoring and rule-based explanation for framework selection.",
    priority: "High",
    status: "Completed",
    dueDate: "2026-08-10",
    aiGenerated: false
  }
];