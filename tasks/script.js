
const headingInput = document.querySelector('.task-heading textarea');
const descriptionInput = document.getElementById('description');
const createButton = document.querySelector('.bottom-btn:nth-of-type(2)');
const cancelButton = document.querySelector('.bottom-btn:nth-of-type(1)');
const todoList = document.getElementById('todo-list');

const detailBox = document.getElementById('task-details');
const closeButton = document.getElementById('close-details');
const detailHeading = document.getElementById('detail-heading');
const detailDescription = document.getElementById('detail-description');

function addTask() {
  const heading = headingInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!heading) return;

  const li = document.createElement('li');
  li.textContent = heading;

  li.dataset.heading = heading;
  li.dataset.description = description;

  li.addEventListener('click', function () {

    detailBox.style.display = "block";

    detailHeading.textContent = this.dataset.heading;
    detailDescription.textContent =
      this.dataset.description || "No description provided.";

  });

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

closeButton.addEventListener('click', function () {
  detailBox.style.display = "none";
});

headingInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    addTask();
  }
});
function showPopup({
    message = "Hello!",
    timeout = 5,
    buttonText = "Close"
}) {

    const popup = document.querySelector(".popup");
    const messageEl = popup.querySelector(".popup-message");
    const countdownEl = popup.querySelector(".countdown");
    const closeBtn = popup.querySelector(".close-popup");

    let countdown = timeout;

    messageEl.textContent = message;
    closeBtn.textContent = buttonText;
    countdownEl.textContent = `Closing in ${countdown} seconds...`;

    popup.style.display = "flex";

    let timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = `Closing in ${countdown} seconds...`;

        if (countdown <= 0) {
            clearInterval(timer);
            popup.style.display = "none";
        }
    }, 1000);

    closeBtn.onclick = () => {
        clearInterval(timer);
        popup.style.display = "none";
    };
}

document.addEventListener("DOMContentLoaded", function () {

    let currentUser = localStorage.getItem("currentUser");

    if (currentUser) {

        let user = JSON.parse(currentUser);

        showPopup({
            message: `Welcome, ${user.name}!`,
            timeout: 5,
            buttonText: "Close"
        });

        localStorage.removeItem("currentUser");
    }

});