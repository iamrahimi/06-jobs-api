import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "../index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEditTaskTracker.js";

let taskTrackerDiv = null;
let taskTrackerTable = null;
let taskTrackerTableHeader = null;
let taskTrackerTableBody = null;

export const handleTaskTracker = () => {
  taskTrackerDiv = document.getElementById("task-tracker-list");
  const logoff = document.getElementById("logoff");
  const addTaskTracker = document.getElementById("add-task-tracker");
  taskTrackerTable = document.getElementById("task-tracker-table");
  taskTrackerTableHeader = document.getElementById("task-tracker-table-header");
  taskTrackerTableBody = document.getElementById('task-tracker-table-body')


  taskTrackerDiv.addEventListener("click", (e) => {
        const taskTrackerId = e.target.getAttribute('data-id');
        const button = e.target.getAttribute('action');

    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addTaskTracker) {
        showAddEdit(null);

      } else if (e.target === logoff) {
        showLoginRegister();

      }else if(taskTrackerId != null && button == 'edit') {
        showAddEdit(taskTrackerId);
    }
    }
  });
};

export const showTaskTracker = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/task-tracker", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const {data} = await response.json();
     
    let children = [taskTrackerTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        console.log('true')
        taskTrackerTable.replaceChildren(...children); // clear this for safety
      } else {
        let tableData = "";
        // let {data} = data;
        for (let i = 0; i < data.length; i++) {
          tableData += `<tr>
                          <td>${i + 1}</td>
                          <td>${data[i].title}</td>
                          <td>${data[i].description}</td>
                          <td>${data[i].proiority}</td>
                          <td>${data[i].createdAt}</td>
                          <td>${data[i].status}</td>
                          <td>
                              <button type="button" class="editButton button" action='edit' data-id=${data[i]._id}>edit</button>
                              <button type="button" class="deleteButton button" action='delete' data-id=${data[i]._id}>Delete</button>
                          </td>
                        </tr>`;
        }
        taskTrackerTableBody.innerHTML = tableData;
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(taskTrackerDiv);
};