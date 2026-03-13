  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");

  document.getElementById("show-signup").addEventListener("click", function(e) {
    e.preventDefault();
    loginContainer.classList.remove("active");
    signupContainer.classList.add("active");
  });

  document.getElementById("show-login").addEventListener("click", function(e) {
    e.preventDefault();
    signupContainer.classList.remove("active");
    loginContainer.classList.add("active");
  });
