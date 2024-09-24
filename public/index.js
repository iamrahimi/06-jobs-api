let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;

import { showTaskTracker, handleTaskTracker } from "./script/task-tracker.js";
// import { showLoginRegister, handleLoginRegister } from "./script/loginRegister.js";
import { showLogin } from "./script/login.js";
import { handleLogin } from "./script/login.js";
import { handleAddEdit } from "./script/addEditTaskTracker.js";
import { handleAddEditProject } from "./script/addEditProject.js";
import { handleRegister } from "./script/register.js";
import {showProjects, handleProjects} from "./script/projects.js"

document.getElementById('home').addEventListener("click", (e) => {
      showTaskTracker(); 
});

document.getElementById('project').addEventListener("click", (e) => {
  showProjects(); 
});

document.getElementById('logout').addEventListener("click", (e) => {
    setToken(null);
    message.textContent = "You have been logged off.";
    showLogin();
});

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  // handleLoginRegister();
  handleProjects();
  handleLogin();
  handleTaskTracker();
  handleRegister();
  handleAddEdit();
  handleAddEditProject();
  if (token) {
    showTaskTracker();
    document.getElementById('menubar').style.display = "block";
  } else {
    showLogin();
  }
});