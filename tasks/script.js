// -------------------- SELECTORS --------------------
const headingInput = document.querySelector('.task-heading textarea');
const descriptionInput = document.getElementById('description');
const createButton = document.querySelector('.bottom-btn:nth-of-type(2)');
const cancelButton = document.querySelector('.bottom-btn:nth-of-type(1)');
const todoList = document.getElementById('todo-list');

const detailBox = document.getElementById('task-details');
const closeButton = document.getElementById('close-details');
const detailHeading = document.getElementById('detail-heading');
const detailDescription = document.getElementById('detail-description');

const completeBtn = document.getElementById('complete-task');

// -------------------- HELPER FUNCTIONS --------------------

// Get currently logged-in user
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

// Get tasks for current user
function getUserTasks() {
    const user = getCurrentUser();
    if (!user) return [];

    const tasksData = JSON.parse(localStorage.getItem("tasks")) || {};
    return tasksData[user.email] || [];
}

// Save tasks for current user
function saveUserTasks(tasks) {
    const user = getCurrentUser();
    if (!user) return;

    const tasksData = JSON.parse(localStorage.getItem("tasks")) || {};
    tasksData[user.email] = tasks;

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// Render tasks
function renderTasks() {
    todoList.innerHTML = "";
    const runningList = document.getElementById("running-list");
    const completedList = document.getElementById("completed-list");

    runningList.innerHTML = "";
    completedList.innerHTML = "";

    const tasks = getUserTasks();

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.heading;
        li.dataset.index = index;
        

        li.draggable = true;

// when drag starts
li.addEventListener("dragstart", function(e) {
    e.dataTransfer.setData("text/plain", index);
});


        li.addEventListener('click', function() {
            detailBox.style.display = "block";
            detailHeading.textContent = task.heading;
            detailDescription.textContent = task.description || "No description provided.";

            completeBtn.dataset.index = index;
            runningBtn.dataset.index = index;
        });

        if (task.status === "todo") {
            todoList.appendChild(li);
        } else if (task.status === "running") {
            runningList.appendChild(li);
        } else if (task.status === "completed") {
            completedList.appendChild(li);
        }
    });
}

function add_running(){
    
}
// -------------------- TASK ACTIONS --------------------

// Add task
function addTask() {
    const heading = headingInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!heading) return;

    const tasks = getUserTasks();

    tasks.push({
        heading: heading,
        description: description,
        status: "todo"
    });

    saveUserTasks(tasks);
    renderTasks();

    headingInput.value = '';
    descriptionInput.value = '';
}

// Clear form
function clearForm() {
    headingInput.value = '';
    descriptionInput.value = '';
    headingInput.focus();
}

// Complete (delete) task
function completeTask() {
    const index = completeBtn.dataset.index;
    if (index === undefined) return;

    const tasks = getUserTasks();

    tasks[index].status = "completed";

    saveUserTasks(tasks);
    renderTasks();

    detailBox.style.display = "none";
}

// Close task details
function closeTaskDetails() {
    detailBox.style.display = "none";
}

// -------------------- EVENT LISTENERS --------------------
createButton.addEventListener('click', addTask);
cancelButton.addEventListener('click', clearForm);
closeButton.addEventListener('click', closeTaskDetails);
completeBtn.addEventListener('click', completeTask);

// Enter key to add task
headingInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addTask();
    }
});

// -------------------- LOGOUT --------------------
document.getElementById("logout-button").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
});

// -------------------- INITIAL CHECK --------------------
document.addEventListener("DOMContentLoaded", function() {
    const user = getCurrentUser();

    if (!user) {
        alert("Please login first");
        window.location.href = "../index.html";
        return;
    }

    renderTasks();
});

  const btn = document.querySelector(".new-task button");
  const additional = document.querySelector(".additonal");

  btn.addEventListener("click", () => {
    if (additional.style.display === "none" || additional.style.display === "") {
      additional.style.display = "block";
    } else {
      additional.style.display = "none";
    }
  });



  const runningBtn = document.getElementById("running-btn");

function moveToRunning() {
    const index = runningBtn.dataset.index;
    if (index === undefined) return;

    const tasks = getUserTasks();

    tasks[index].status = "running";

    saveUserTasks(tasks);
    renderTasks();

    detailBox.style.display = "none";
}

runningBtn.addEventListener("click", moveToRunning);

const columns = [
    { element: todoList, status: "todo" },
    { element: document.getElementById("running-list"), status: "running" },
    { element: document.getElementById("completed-list"), status: "completed" }
];

columns.forEach(col => {
    // allow drop
    col.element.addEventListener("dragover", function(e) {
        e.preventDefault();
    });

    // handle drop
    col.element.addEventListener("drop", function(e) {
        e.preventDefault();

        const index = e.dataTransfer.getData("text/plain");
        const tasks = getUserTasks();

        if (tasks[index]) {
            tasks[index].status = col.status;

            saveUserTasks(tasks);
            renderTasks();
        }
    });
});