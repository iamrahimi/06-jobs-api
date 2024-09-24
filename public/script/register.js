import {
    inputEnabled,
    setDiv,
    message,
    token,
    enableInput,
    setToken,
  } from "../index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showTaskTracker } from "./task-tracker.js";
  
  let registerDiv = null;
  let name = null;
  let email1 = null;
  let password1 = null;
  let password2 = null;
  let errorMessage = null;

  // Error message veriables
  let emailErrorLabel = null;
  let nameErrorLabel = null;
  let passwordErrorLabel = null;
  
  export const handleRegister = () => {
    registerDiv = document.getElementById("register-div");
    name = document.getElementById("name");
    email1 = document.getElementById("email-register");
    password1 = document.getElementById("password-register");
    password2 = document.getElementById("confirm-password");
    errorMessage = document.getElementById('error-div');
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");


    emailErrorLabel = document.getElementById('email-register-error-label');
    nameErrorLabel = document.getElementById('name-error-label');
    passwordErrorLabel = document.getElementById('password-register-error-label');
  
    registerDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "INPUT") {
          if (e.target === registerButton) {
            if (password1.value != password2.value) {
              message.textContent = "The passwords entered do not match.";
              passwordErrorLabel.innerHTML = "The passwords entered do not match.";
            } else {
              enableInput(false);
    
              try {
               let userRole = document.querySelector('input[name="user-role"]:checked').value;
                const response = await fetch("/api/v1/auth/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: name.value,
                    email: email1.value,
                    password: password1.value,
                    role: userRole
                  }),
                });
    
                const data = await response.json();
                if (response.status === 201) {
                  message.textContent = `Registration successful.  Welcome ${data.user.name}`;
                  setToken(data.token);
    
                  name.value = "";
                  email1.value = "";
                  password1.value = "";
                  password2.value = "";
    
                  showTaskTracker();
                } else {
                  message.textContent = data.msg;
                  const {errors} = data.err;

                   if(errors){
                    emailErrorLabel.innerHTML = "";
                    nameErrorLabel.innerHTML = "";
                    passwordErrorLabel.innerHTML = "";

                    if(errors['email']){
                      emailErrorLabel.innerHTML = errors['email']['message'];
                    }

                    if(errors['name']){
                      nameErrorLabel.innerHTML = errors['name']['message'];
                    }

                    if(errors['password']){
                      passwordErrorLabel.innerHTML = errors['password']['message'];
                    }
                   }
                }
              } catch (err) {
                console.error(err);
                message.textContent = "A communications error occurred.";
              }
    
              enableInput(true);
            }
          } else if (e.target === registerCancel) {
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
            showLoginRegister();
          }
        }
      });
    };
    
    export const showRegister = () => {
      email1.value = null;
      password1.value = null;
      password2.value = null;
      setDiv(registerDiv);
    };