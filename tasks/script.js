// -------------------- FIREBASE IMPORTS --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc, 
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// -------------------- CONFIG --------------------
const firebaseConfig = {
  apiKey: "AIzaSyBdmDP0qznW_yn9KEG0ipzRyk8m_kKhTus",
  authDomain: "trello-clone-29492.firebaseapp.com",
  projectId: "trello-clone-29492",
  storageBucket: "trello-clone-29492.appspot.com",
  messagingSenderId: "339885575591",
  appId: "1:339885575591:web:a0d47181017202034d7a82",
  measurementId: "G-417CQ4PY3G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------- CURRENT USER --------------------
function getCurrentUser() {
  const u = localStorage.getItem("currentUser");
  return u ? JSON.parse(u) : null;
}

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  // Set user info in nav
  const nameEl = document.getElementById("user-name");
  const avatarEl = document.getElementById("user-avatar");
  if (nameEl) nameEl.textContent = user.name || user.email.split("@")[0];
  if (avatarEl) avatarEl.textContent = (user.name || user.email)[0].toUpperCase();

  renderTasks();
});

// -------------------- FETCH --------------------
async function getUserTasks() {
  const user = getCurrentUser();
  if (!user) return [];

  const snapshot = await getDocs(collection(db, "tasks"));
  const tasks = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.userEmail === user.email || data.assignedTo === user.email) {
      tasks.push({ id: docSnap.id, ...data });
    }
  });

  return tasks;
}

// -------------------- RENDER --------------------
async function renderTasks() {
  const todoList      = document.getElementById("todo-list");
  const runningList   = document.getElementById("running-list");
  const completedList = document.getElementById("completed-list");

  todoList.innerHTML = runningList.innerHTML = completedList.innerHTML = "";

  const tasks = await getUserTasks();
  const currentUser = getCurrentUser();

  const counts = { todo: 0, running: 0, completed: 0 };

  tasks.forEach((task) => {
    const card = createTaskCard(task, currentUser);

    if (task.status === "todo") {
      todoList.appendChild(card);
      counts.todo++;
    } else if (task.status === "running") {
      runningList.appendChild(card);
      counts.running++;
    } else {
      completedList.appendChild(card);
      counts.completed++;
    }
  });

  // Update counts
  document.getElementById("todo-count").textContent      = counts.todo;
  document.getElementById("running-count").textContent   = counts.running;
  document.getElementById("completed-count").textContent = counts.completed;

  // Empty states
  [
    { el: todoList,      label: "No tasks yet" },
    { el: runningList,   label: "Nothing in progress" },
    { el: completedList, label: "Nothing completed yet" },
  ].forEach(({ el, label }) => {
    if (!el.children.length) {
      el.innerHTML = `
        <div class="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="12" y2="12"/>
          </svg>
          <span>${label}</span>
        </div>`;
    }
  });
}

async function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "tasks", id));
    closeDrawer();
    renderTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
    alert("Failed to delete task");
  }
}

function createTaskCard(task, currentUser) {
  const li = document.createElement("li");
  li.className = "task-card";
  li.dataset.id = task.id;
  li.draggable = true;

  // Label logic
  let metaText = "";
  if (task.userEmail === currentUser.email && task.assignedTo && task.assignedTo !== task.userEmail) {
    metaText = `Assigned to ${task.assignedTo}`;
  } else if (task.assignedTo === currentUser.email && task.userEmail !== currentUser.email) {
    metaText = `From ${task.assignedBy || "someone"}`;
  }

  li.innerHTML = `
    <div class="card-title">${escapeHtml(task.heading)}</div>
    ${metaText ? `
    <div class="card-meta">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      ${escapeHtml(metaText)}
    </div>` : ""}
  `;

  // Drag events
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    setTimeout(() => li.classList.add("dragging"), 0);
  });
  li.addEventListener("dragend", () => li.classList.remove("dragging"));

  // Click → open drawer
  li.addEventListener("click", () => openDrawer(task));

  return li;
}

function escapeHtml(str = "") {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// -------------------- DRAWER --------------------
let activeTaskId = null;

function openDrawer(task) {
  activeTaskId = task.id;

  const drawer  = document.getElementById("task-drawer");
  const overlay = document.getElementById("drawer-overlay");

  document.getElementById("drawer-heading").textContent     = task.heading;
  document.getElementById("drawer-description").textContent = task.description || "No description provided.";

  const statusBadge = document.getElementById("drawer-status-badge");
  const statusMap = {
    todo:      ["To Do",       "status-todo"],
    running:   ["In Progress", "status-running"],
    completed: ["Completed",   "status-completed"],
  };
  const [label, cls] = statusMap[task.status] || ["Unknown", "status-todo"];
  statusBadge.textContent = label;
  statusBadge.className = `drawer-status ${cls}`;

  // Meta
  const meta = document.getElementById("drawer-meta");
  meta.innerHTML = "";
  if (task.assignedTo) {
    meta.innerHTML += `
      <div class="meta-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Assigned to: ${escapeHtml(task.assignedTo)}
      </div>`;
  }
  if (task.assignedBy) {
    meta.innerHTML += `
      <div class="meta-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Created by: ${escapeHtml(task.assignedBy)}
      </div>`;
  }

  drawer.classList.add("open");
  overlay.classList.add("open");
}

function closeDrawer() {
  document.getElementById("task-drawer").classList.remove("open");
  document.getElementById("drawer-overlay").classList.remove("open");
  activeTaskId = null;
}

document.getElementById("close-drawer").addEventListener("click", closeDrawer);
document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);

document.getElementById("move-todo").addEventListener("click", () => {
  if (activeTaskId) updateTaskStatus(activeTaskId, "todo");
});
document.getElementById("move-running").addEventListener("click", () => {
  if (activeTaskId) updateTaskStatus(activeTaskId, "running");
});
document.getElementById("move-done").addEventListener("click", () => {
  if (activeTaskId) updateTaskStatus(activeTaskId, "completed");
});

// -------------------- UPDATE STATUS --------------------
async function updateTaskStatus(id, status) {
  const ref = doc(db, "tasks", id);
  await updateDoc(ref, { status });
  closeDrawer();
  renderTasks();
}

// -------------------- ADD TASK --------------------
async function addTask() {
  const heading     = document.getElementById("task-heading").value.trim();
  const description = document.getElementById("description").value.trim();
  const assignInput = document.getElementById("assign-email");
  const assignedTo  = assignInput ? assignInput.value.trim() : "";

  if (!heading) {
    document.getElementById("task-heading").focus();
    return;
  }

  const user = getCurrentUser();

  const createBtn = document.getElementById("create-btn");
  createBtn.disabled = true;
  createBtn.textContent = "Creating…";

  await addDoc(collection(db, "tasks"), {
    heading,
    description,
    status: "todo",
    userEmail:  user.email,
    assignedTo: assignedTo || user.email,
    assignedBy: user.name || user.email,
  });

  // Clear form
  document.getElementById("task-heading").value = "";
  document.getElementById("description").value = "";
  if (assignInput) assignInput.value = "";

  createBtn.disabled = false;
  createBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Create Task`;

  renderTasks();
}

// -------------------- DRAG & DROP --------------------
document.querySelectorAll(".task-list").forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    list.classList.add("drag-over");
  });
  list.addEventListener("dragleave", () => list.classList.remove("drag-over"));
  list.addEventListener("drop", async (e) => {
    e.preventDefault();
    list.classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    const status = list.dataset.status;
    await updateTaskStatus(id, status);
  });
});

// -------------------- EVENTS --------------------
document.getElementById("create-btn").addEventListener("click", addTask);

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("task-heading").value = "";
  document.getElementById("description").value = "";
  const assignInput = document.getElementById("assign-email");
  if (assignInput) assignInput.value = "";
});

document.getElementById("delete-task").addEventListener("click", () => {
  if (activeTaskId) deleteTask(activeTaskId);
});

document.getElementById("task-heading").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addTask(); }
});

document.getElementById("toggle-additional").addEventListener("click", () => {
  const section = document.getElementById("additional-section");
  const btn     = document.getElementById("toggle-additional");
  const isOpen  = section.classList.toggle("open");
  btn.innerHTML = isOpen
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg> Fewer options`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Additional options`;
});

// -------------------- LOGOUT --------------------
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
});