import { message, token } from "../index.js";


let projectListTaskTracker = null;
let userListTaskTracker = null;

export const setSelectProjectList = async () => {

    projectListTaskTracker = document.getElementById('project-id');
    try {
        const response = await fetch("/api/v1/project", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    
        const {data} = await response.json();

        let projectlistData = "<option>Please select project</option>";
        for (let i = 0; i < data.length; i++) {
            projectlistData += `<option value="${data[i]._id}">${data[i].name}</option>`;
        }

        projectListTaskTracker.innerHTML = projectlistData;

        
      } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
      }
  };

export const setSelectUserList = async () => {

    userListTaskTracker = document.getElementById('assigned-to');
    try {
        const response = await fetch("/api/v1/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    
        const {data} = await response.json();
        let userlistData = "<option>Please select user</option>";
        for (let i = 0; i < data.length; i++) {
            userlistData += `<option value="${data[i]._id}">${data[i].name}</option>`;
        }
        userListTaskTracker.innerHTML = userlistData;

        
      } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
      }
  };