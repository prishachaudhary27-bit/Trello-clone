// -------------------- FIREBASE IMPORTS --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
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

// -------------------- SELECTORS --------------------
const headingInput = document.querySelector(".task-heading textarea");
const descriptionInput = document.getElementById("description");
const assignInput = document.getElementById("assign-email"); // ✅ NEW

const createButton = document.querySelector(".bottom-btn:nth-of-type(2)");
const cancelButton = document.querySelector(".bottom-btn:nth-of-type(1)");

const todoList = document.getElementById("todo-list");
const runningList = document.getElementById("running-list");
const completedList = document.getElementById("completed-list");

const detailBox = document.getElementById("task-details");
const closeButton = document.getElementById("close-details");
const detailHeading = document.getElementById("detail-heading");
const detailDescription = document.getElementById("detail-description");

const completeBtn = document.getElementById("complete-task");
const runningBtn = document.getElementById("running-btn");

// -------------------- USER --------------------
function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

// -------------------- FETCH TASKS --------------------
async function getUserTasks() {
  const user = getCurrentUser();
  if (!user) return [];

  const snapshot = await getDocs(collection(db, "tasks"));

  let tasks = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.userEmail === user.email || data.assignedTo === user.email) {
      tasks.push({
        id: docSnap.id,
        ...data,
      });
    }
  });

  return tasks;
}

// -------------------- RENDER --------------------
async function renderTasks() {
  todoList.innerHTML = "";
  runningList.innerHTML = "";
  completedList.innerHTML = "";

  const tasks = await getUserTasks();

  tasks.forEach((task) => {
    const li = document.createElement("li");

    // show who assigned it (optional UI improvement)
   let label = task.heading;

// CASE 1: you assigned to someone else
if (task.userEmail === getCurrentUser().email && task.assignedTo && task.assignedTo !== task.userEmail) {
    label = `${task.heading} (Assigned to: ${task.assignedTo})`;
}

// CASE 2: someone assigned task to you
else if (task.assignedTo === getCurrentUser().email && task.userEmail !== getCurrentUser().email) {
    label = `${task.heading} (Assigned by: ${task.assignedBy || "Unknown"})`;
}

// CASE 3: normal task → no extra text
else {
    label = task.heading;
}

li.textContent = label;

    li.dataset.id = task.id;

    // DRAG
    li.draggable = true;
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
    });

    // DETAILS
    li.addEventListener("click", () => {
      detailBox.style.display = "block";
      detailHeading.textContent = task.heading;
      detailDescription.textContent = task.description || "No description";

      completeBtn.dataset.id = task.id;
      runningBtn.dataset.id = task.id;
    });

    // APPEND
    if (task.status === "todo") {
      todoList.appendChild(li);
    } else if (task.status === "running") {
      runningList.appendChild(li);
    } else {
      completedList.appendChild(li);
    }
  });
}

// -------------------- ADD TASK --------------------
async function addTask() {
  const heading = headingInput.value.trim();
  const description = descriptionInput.value.trim();
  const assignedTo = assignInput ? assignInput.value.trim() : "";

  if (!heading) return;

  const user = getCurrentUser();

  await addDoc(collection(db, "tasks"), {
    heading,
    description,
    status: "todo",

    userEmail: user.email, // creator
    assignedTo: assignedTo || user.email, // assigned user
    assignedBy: user.name || user.email,
  });

  renderTasks();

  headingInput.value = "";
  descriptionInput.value = "";
  if (assignInput) assignInput.value = "";
}

// -------------------- UPDATE STATUS --------------------
async function updateTaskStatus(id, status) {
  const ref = doc(db, "tasks", id);
  await updateDoc(ref, { status });
  renderTasks();
}

// -------------------- BUTTON ACTIONS --------------------
completeBtn.addEventListener("click", () => {
  const id = completeBtn.dataset.id;
  updateTaskStatus(id, "completed");
  detailBox.style.display = "none";
});

runningBtn.addEventListener("click", () => {
  const id = runningBtn.dataset.id;
  updateTaskStatus(id, "running");
  detailBox.style.display = "none";
});

// -------------------- DRAG & DROP --------------------
const columns = [
  { element: todoList, status: "todo" },
  { element: runningList, status: "running" },
  { element: completedList, status: "completed" },
];

columns.forEach((col) => {
  col.element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  col.element.addEventListener("drop", async (e) => {
    e.preventDefault();

    const id = e.dataTransfer.getData("text/plain");
    await updateTaskStatus(id, col.status);
  });
});

// -------------------- FORM --------------------
function clearForm() {
  headingInput.value = "";
  descriptionInput.value = "";
  if (assignInput) assignInput.value = "";
}

function closeTaskDetails() {
  detailBox.style.display = "none";
}

// -------------------- EVENTS --------------------
createButton.addEventListener("click", addTask);
cancelButton.addEventListener("click", clearForm);
closeButton.addEventListener("click", closeTaskDetails);

// ENTER KEY
headingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    addTask();
  }
});

// -------------------- LOGOUT --------------------
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
});

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();

  if (!user) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  renderTasks();
});

// -------------------- ADDITIONAL TOGGLE --------------------
const btn = document.querySelector(".new-task button");
const additional = document.querySelector(".additonal");

btn.addEventListener("click", () => {
  additional.style.display =
    additional.style.display === "block" ? "none" : "block";
});
