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

// Initialize
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ---------------- SIGNUP ----------------
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let message = document.getElementById("signup-message");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      let user = userCredential.user;

      updateProfile(user, { displayName: name });

      
      const userData = {
        email: user.email,
        name: name
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));

      window.location.href = "tasks/index.html";
    })
    .catch((error) => {
      message.style.color = "red";
      message.textContent = error.message;
    });
});


// ---------------- LOGIN ----------------
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.getElementById("login-email").value.trim();
  let password = document.getElementById("login-password").value.trim();
  let message = document.getElementById("login-message");

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      let user = userCredential.user;

      
      const userData = {
        email: user.email,
        name: user.displayName || ""
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));

      window.location.href = "tasks/index.html";
    })
    .catch((error) => {
      message.style.color = "red";
      message.textContent = error.message;
    });
});


// ---------------- AUTH STATE ----------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("No user");
  }
});

const signupContainer = document.getElementById("signup-container");
const loginContainer = document.getElementById("login-container");

document.getElementById("show-signup").addEventListener("click", () => {
    signupContainer.classList.add("active");
    loginContainer.classList.remove("active");
});

document.getElementById("show-login").addEventListener("click", () => {
    loginContainer.classList.add("active");
    signupContainer.classList.remove("active");
});