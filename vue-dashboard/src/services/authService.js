import { initialUsers } from "../data/initialData";

const USERS_KEY = "vue_taskflow_users";
const CURRENT_USER_KEY = "vue_taskflow_current_user";

function loadUsers() {
  const storedUsers = localStorage.getItem(USERS_KEY);

  if (!storedUsers) {
    return initialUsers;
  }

  try {
    return JSON.parse(storedUsers);
  } catch {
    return initialUsers;
  }
}

function loadCurrentUser() {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

let users = loadUsers();
let currentUser = loadCurrentUser();

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

const authService = {
  getUsers() {
    return [...users];
  },

  getCurrentUser() {
    return currentUser;
  },

  login(email, password) {
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      return null;
    }

    currentUser = foundUser;
    saveCurrentUser();

    return foundUser;
  },

  register(userData) {
    const emailExists = users.some((user) => user.email === userData.email);

    if (emailExists) {
      return {
        success: false,
        message: "This email is already registered."
      };
    }

    const newUser = {
      id: Date.now(),
      ...userData
    };

    users = [...users, newUser];
    saveUsers();

    return {
      success: true,
      message: "Registration successful. Please login."
    };
  },

  logout() {
    currentUser = null;
    saveCurrentUser();
  },

  getAdminUserCount() {
    return users.filter((user) => user.role === "Admin").length;
  },

  getNormalUserCount() {
    return users.filter((user) => user.role === "User").length;
  }
};

export default authService;