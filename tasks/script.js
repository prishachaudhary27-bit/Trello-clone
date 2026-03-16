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
const closeTaskBtn = document.getElementById('close-task');

// -------------------- HELPER FUNCTIONS --------------------

// Get currently logged-in user
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

// Get tasks for current user from localStorage
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

// Render all tasks in To-do list
function renderTasks() {
    todoList.innerHTML = "";
    const tasks = getUserTasks();

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task[0]; // task heading
        li.dataset.index = index;

        li.addEventListener('click', function() {
            detailBox.style.display = "block";
            detailHeading.textContent = task[0];
            detailDescription.textContent = task[1] || "No description provided.";
            completeBtn.dataset.index = index;
        });

        todoList.appendChild(li);
    });
}

// -------------------- EVENT HANDLERS --------------------

// Add new task
function addTask() {
    const heading = headingInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!heading) return;

    const tasks = getUserTasks();
    tasks.push([heading, description]); // add as array
    saveUserTasks(tasks);

    renderTasks();

    headingInput.value = '';
    descriptionInput.value = '';
    headingInput.focus();
}

// Clear new task form
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
    tasks.splice(index, 1); // remove task
    saveUserTasks(tasks);

    renderTasks();
    detailBox.style.display = "none";
}

// Close task details without deleting
function closeTaskDetails() {
    detailBox.style.display = "none";
}

// -------------------- EVENT LISTENERS --------------------
createButton.addEventListener('click', addTask);
cancelButton.addEventListener('click', clearForm);
closeButton.addEventListener('click', closeTaskDetails);
completeBtn.addEventListener('click', completeTask);

// Enter key adds task
headingInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addTask();
    }
});

// -------------------- INITIALIZE --------------------
document.addEventListener("DOMContentLoaded", function() {
    const user = getCurrentUser();
    if (!user) {
        alert("No user logged in! Redirecting to login page...");
        window.location.href = "../index.html";
        return;
    }
    renderTasks();
});