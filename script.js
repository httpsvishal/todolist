const taskForm = document.getElementById("todo-form");
const newTaskInput = document.getElementById("new-task-title");
const tasksContainer = document.getElementById("all-tasks");

let uncheckedUrl = "./assets/unchecked-logo.svg";
let removeSvgUrl = "./assets/delete-logo.svg";
let checkedUrl = "./assets/checked-logo.svg";
let allTasks = {};
let taskId = 1;

createTask = (newTaskName, taskStatusData = "unchecked", id) => {
    if (!id) {
        id = taskId;
        taskId++;
    }
    let li = document.createElement("li");
    li.dataset.id = id;

    let taskWrapper = document.createElement("span");
    taskWrapper.classList.add("task-title-wrapper");
    let taskName = document.createElement("span");
    taskName.classList.add("task-title");
    taskName.innerText = newTaskName;
    if(taskStatusData=="checked") taskName.classList.add("checked");
    taskWrapper.append(taskName);

    let taskStatus = document.createElement("img");
    taskStatus.dataset.status = taskStatusData;
    if (taskStatus.dataset.status == "checked")
        taskStatus.src = checkedUrl;
    else
        taskStatus.src = uncheckedUrl;

    let removeIcon = document.createElement("img");
    removeIcon.src = removeSvgUrl;

    li.append(taskWrapper, taskStatus, removeIcon);
    tasksContainer.append(li);

    let taskData = {
        "taskName": newTaskName,
        status: taskStatusData
    };
    console.log(taskData, newTaskName);
    allTasks[id] = taskData;

    //Added EventListeners
    taskStatus.addEventListener("click", () => {
        console.log("hey");
        if (taskStatus.dataset.status === "unchecked") {
            taskStatus.dataset.status = "checked";
            taskStatus.src = checkedUrl;
            allTasks[id].status = "checked";
        }
        else {
            taskStatus.src = uncheckedUrl;
            taskStatus.dataset.status = "unchecked";
            allTasks[id].status = "unchecked";
        }
        taskName.classList.toggle("checked");
        saveChangesToLocal();
        fetchAndShowTasks();
    })

    removeIcon.addEventListener("click", () => {
        li.remove();
        delete allTasks[id];
        saveChangesToLocal();
    })

    let isTask = true;
    let editTaskForm = document.createElement("form");
    editTaskForm.classList.add("edit-task-form");
    let editTaskInput = document.createElement("input");
    editTaskInput.type = "text";
    editTaskInput.setAttribute("required", true);
    editTaskInput.setAttribute("autofocus", true);
    let editButton = document.createElement("button");
    editButton.innerText = "Save Changes";

    taskWrapper.addEventListener("click", () => {
        if (isTask) {
            isTask = false;
            let currTaskValue = taskName.innerText;
            taskName.remove();
            editTaskInput.value = currTaskValue;
            editTaskForm.append(editTaskInput, editButton);
            taskWrapper.append(editTaskForm);
        }
    })

    let saveChanges = (e) => {
        e.preventDefault();
        editTaskForm.remove();
        taskName.innerText = editTaskInput.value;
        taskWrapper.append(taskName);
        isTask = true;
        allTasks[id].taskName = taskName.innerText;
        saveChangesToLocal();
    }

    editTaskForm.addEventListener("submit", saveChanges);
}

const fetchAndShowTasks = ()=>{
    tasksContainer.innerHTML = "";
    if (localStorage.getItem("allTasks") !== null) {
        let allPrevTasks = JSON.parse(localStorage.getItem("allTasks"));
        allkeys = Object.keys(allPrevTasks);
        allkeys.sort((a,b)=>{
            if(allPrevTasks[a].status==="unchecked")
                return -1;
            return 1;
        })
        if (allkeys.length > 0)
            taskId = Math.max(...allkeys) + 1;
        console.log(taskId)
        allkeys.forEach((key) => {
            createTask(allPrevTasks[key].taskName, allPrevTasks[key].status, key);
        })
    }
}

const addTask = (e) => {
    e.preventDefault();
    let newTaskName = newTaskInput.value;
    createTask(newTaskName);
    newTaskInput.value = "";
    saveChangesToLocal();
}

taskForm.addEventListener("submit", addTask);

const saveChangesToLocal = () => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

addEventListener("pagehide", () => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
})

fetchAndShowTasks();