// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdmDP0qznW_yn9KEG0ipzRyk8m_kKhTus",
  authDomain: "trello-clone-29492.firebaseapp.com",
  projectId: "trello-clone-29492",
  storageBucket: "trello-clone-29492.appspot.com",
  messagingSenderId: "339885575591",
  appId: "1:339885575591:web:a0d47181017202034d7a82",
  measurementId: "G-417CQ4PY3G"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ---- TAB SWITCHING ----
const loginContainer  = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const showLoginBtn    = document.getElementById("show-login");
const showSignupBtn   = document.getElementById("show-signup");

function activateTab(show, hide, activeBtn, inactiveBtn) {
  show.classList.add("active");
  hide.classList.remove("active");
  activeBtn.classList.add("active");
  inactiveBtn.classList.remove("active");
}

showLoginBtn.addEventListener("click",  () => activateTab(loginContainer,  signupContainer, showLoginBtn,  showSignupBtn));
showSignupBtn.addEventListener("click", () => activateTab(signupContainer, loginContainer,  showSignupBtn, showLoginBtn));

// ---- SIGNUP ----
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name     = document.getElementById("name").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message  = document.getElementById("signup-message");

  message.style.color = "";
  message.textContent = "";

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      updateProfile(user, { displayName: name });
      localStorage.setItem("currentUser", JSON.stringify({ email: user.email, name }));
      window.location.href = "tasks/index.html";
    })
    .catch((error) => {
      message.style.color = "#ff6b6b";
      message.textContent = error.message;
    });
});

// ---- LOGIN ----
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const message  = document.getElementById("login-message");

  message.textContent = "";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("currentUser", JSON.stringify({ email: user.email, name: user.displayName || "" }));
      window.location.href = "tasks/index.html";
    })
    .catch((error) => {
      message.style.color = "#ff6b6b";
      message.textContent = error.message;
    });
});

// ---- AUTH STATE ----
onAuthStateChanged(auth, (user) => {
  if (user) console.log("Logged in:", user.email);
  else console.log("No user");
});