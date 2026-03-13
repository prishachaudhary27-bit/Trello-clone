const headingInput = document.querySelector('.task-heading textarea');
const descriptionInput = document.getElementById('description');
const createButton = document.querySelector('.bottom-btn:nth-of-type(2)');
const cancelButton = document.querySelector('.bottom-btn:nth-of-type(1)');
const todoList = document.getElementById('todo-list');

function addTask() {
  const heading = headingInput.value.trim();
  if (!heading) return;

  const li = document.createElement('li');
  li.textContent = heading;
  todoList.appendChild(li);

  headingInput.value = '';
  descriptionInput.value = '';
  headingInput.focus();
}

function clearForm() {
  headingInput.value = '';
  descriptionInput.value = '';
  headingInput.focus();
}

createButton.addEventListener('click', addTask);
cancelButton.addEventListener('click', clearForm);

// Optional: allow Enter to submit when focus is in the heading textarea
headingInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    addTask();
  }
});
