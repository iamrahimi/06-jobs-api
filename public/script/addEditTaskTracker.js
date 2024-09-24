import { enableInput, inputEnabled, message, setDiv, token } from "../index.js";
import { showTaskTracker } from "./task-tracker.js";
import {setSelectProjectList, setSelectUserList} from'./getProjectsUser.js';

let addEditDiv = null;
let title = null;
let description = null;
let assignedTo = null;
let projectId = null;
let addigTaskTracker = null;

export const handleAddEdit = () => {
  setSelectProjectList();
  setSelectUserList();
  addEditDiv = document.getElementById("new-task-div");
  title = document.getElementById("title");
  description = document.getElementById("description");
  assignedTo = document.getElementById("assigned-to");
  projectId = document.getElementById("project-id");
  addigTaskTracker = document.getElementById("adding-task-tracker");
  const editCancel = document.getElementById("task-tracker-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addigTaskTracker) {
        enableInput(false);
        
        let method = "POST";
        let url = "/api/v1/task-tracker";
        
        if (addigTaskTracker.textContent === "UPDATE") {
            method = "PATCH";
            url = `/api/v1/task-tracker/${addEditDiv.dataset.id}`;
        }
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title : title.value, 
                    description: description.value,
                    assignedTo: assignedTo.value,
                    projectId: projectId.value
                }),

            });
        
            const data = await response.json();
            if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
                // a 200 is expected for a successful update
                message.textContent = "The project entry was updated.";
            } else {
                // a 201 is expected for a successful create
                message.textContent = "The project entry was created.";
            }
        
            title.value = "";
            description.value = "";
            assignedTo.value = "";
            projectId.value = "";
            showTaskTracker();
            } else {
                document.getElementById('task-tracker-validation-error').innerHTML = `<pre>${JSON.stringify(data.err.errors, undefined, 2)}</pre>`;
                message.textContent = data.msg;
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        showTaskTracker();
      }
    }
  });
};

export const showAddEdit = async (taskTrackerId) => {

  if (!taskTrackerId) {
    title.value = "";
    description.value = "";
    projectId.value = "";
    assignedTo.value = "";
    message.textContent = "";

    setDiv(addEditDiv);
    
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/task-tracker/${taskTrackerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.taskTracker.title;
        description.value = data.taskTracker.description;
        assignedTo.value = data.taskTracker.assignedTo;
        projectId.value = data.taskTracker.projectId;
        addigTaskTracker.textContent = "UPDATE";
        message.textContent = "";
        addEditDiv.dataset.id = taskTrackerId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showTaskTracker();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showTaskTracker();
    }

    enableInput(true);
  }
};