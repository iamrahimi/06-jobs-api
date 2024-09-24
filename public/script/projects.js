import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
  } from "../index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showAddEdit } from "./addEditProject.js";
  import { setSelectProjectList } from "./getProjectsUser.js";
  
  let projectDiv = null;
  let projectTable = null;
  let projectTableHeader = null;
  let projectTableBody = null;
  
  export const handleProjects = () => {
    projectDiv = document.getElementById("project-list");
    const logoff = document.getElementById("logoff");
    const addProject = document.getElementById("add-project");
    projectTable = document.getElementById("project-table");
    projectTableHeader = document.getElementById("project-table-header");
    projectTableBody = document.getElementById('project-table-body')
  
  
    projectDiv.addEventListener("click", (e) => {
        
        const projectId = e.target.getAttribute('data-id');
        const button = e.target.getAttribute('action');

      if (inputEnabled && e.target.nodeName === "BUTTON") {

        if (e.target === addProject) {
            showAddEdit(null);

        } else if (e.target === logoff) {
          showLoginRegister();

        } else if(projectId != null && button == 'edit') {
            showAddEdit(projectId);
        }
      }
    });


  };
  
  export const showProjects = async () => {
    setSelectProjectList();
    try {
      enableInput(false);
  
      const response = await fetch("/api/v1/project", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const {data} = await response.json();
       
      let children = [projectTableHeader];
  
      if (response.status === 200) {
        if (data.count === 0) {
          projectTable.replaceChildren(...children); // clear this for safety
        } else {
          let tableData = "";
          for (let i = 0; i < data.length; i++) {
            tableData += `<tr>
                            <td>${i + 1}</td>
                            <td>${data[i].name}</td>
                            <td>${data[i].description}</td>
                            <td>${data[i].createdAt}</td>
                            <td>
                                <button type="button" class="editButtonProject button" action='edit' data-id=${data[i]._id}>edit</button>
                                <button type="button" class="deleteButtonProject button" action='delete' data-id=${data[i]._id}>Delete</button>
                            </td>
                          </tr>`;
          }
          projectTableBody.innerHTML = tableData;
        }
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(projectDiv);
  };