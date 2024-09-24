import { enableInput, inputEnabled, message, setDiv, token } from "../index.js";
import { showProjects } from "./projects.js";


let addEditDiv = null;
let title = null;
let description = null;
let addingProject = null;

export const handleAddEditProject = () => {
  
  addEditDiv = document.getElementById("new-project-div");
  title = document.getElementById("project-name");
  description = document.getElementById("project-description");
  addingProject = document.getElementById("adding-project");
  const editCancel = document.getElementById("project-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingProject) {
        enableInput(false);
        
        let method = "POST";
        let url = "/api/v1/project";
        
        if (addingProject.textContent === "UPDATE") {
            method = "PATCH";
            url = `/api/v1/project/${addEditDiv.dataset.id}`;
        }
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: title.value,
                    description: description.value,
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
            showProjects();
            } else {
                document.getElementById('project-validation-error').innerHTML = `<pre>${JSON.stringify(data.err.errors, undefined, 2)}</pre>`;
                message.textContent = data.msg;
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communication error occurred.";
        }
        enableInput(true);
        }else if (e.target === editCancel) {
            showProjects();
          }
      } else if (e.target === editCancel) {
        showProjects();
      }
  });
};

export const showAddEdit = async (projectId) => {

  if (!projectId) {
    title.value = "";
    description.value = "";
    message.textContent = "";

    setDiv(addEditDiv);
    
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/project/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.project.name;
        description.value = data.project.description;
        addingProject.textContent = "UPDATE";
        message.textContent = "";
        addEditDiv.dataset.id = projectId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showProjects();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showProjects();
    }

    enableInput(true);
  }
};