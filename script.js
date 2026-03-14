
//   login and signup container view and hide logic
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

//   signup form to local storage 

document.getElementById("signup-form").addEventListener("submit",function(e){
    e.preventDefault();//to stop the page from reload

    let name=document.getElementById("name").value;
    let email=document.getElementById("email").value;
    let password=document.getElementById("password").value;
    let message=document.getElementById("signup-message");
    try{

        let users=JSON.parse(localStorage.getItem("users")) || [];
        let existingUser=users.find(user=> user.email === email);

        if(existingUser){
            console.log("User already exits");
            message.textContent="User already exits"
            return;
        }
        let newUser={
            name:name,email:email,password:password
        };
        users.push(newUser);

        localStorage.setItem("users",JSON.stringify(users));

        console.log("Signup successful");
        message.style.color = "green";
        message.textContent="Signup successful";
        
        localStorage.setItem("currentUser", JSON.stringify(newUser));



        // redirecting to home page
        window.location.href="tasks/index.html";

    }catch(error){
        console.log("Error:",error);
    }
});

// login form value matching

document.getElementById("login-form").addEventListener("submit",function(e){

    e.preventDefault();

    let email=document.getElementById("login-email").value;
    let password=document.getElementById("login-password").value;
    let message=document.getElementById("login-message");
    try{

        let users=JSON.parse(localStorage.getItem("users")) || [];
        let user=users.find(u => u.email===email);

        if(!user){
            console.log("No person with this email");
            message.textContent="No person with this email"
            return;
        }

        if(user.password !== password){
            console.log("Password is incorrect");
            message.textContent="Password is incorrect"
            return;
        }

        console.log("Login Successful");
        message.textContent="Login Successful"

        localStorage.setItem("currentUser", JSON.stringify(user));


        // redirect after login successful
        window.location.href="tasks/index.html";
    }catch(error){
        console.log("Error: ",error);
    }
});

