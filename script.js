const taskForm = document.getElementById("todo-form");
const newTaskInput = document.getElementById("new-task-title");
const tasksContainer = document.getElementById("all-tasks");

let uncheckedUrl = "./assets/unchecked-logo.svg";
let removeSvgUrl = "./assets/delete-logo.svg";
let checkedUrl = "./assets/checked-logo.svg";
let allTasks = {};
let taskId = 1;





createTask = (newTaskName,taskStatusData ="unchecked",id ) =>{
    if(!id){
        id = taskId;
        taskId++;
    }
    let li = document.createElement("li");
    li.dataset.id =id;

    let taskName = document.createElement("span");
    taskName.classList.add("task-title");
    taskName.innerText = newTaskName;

    let taskStatus = document.createElement("img");
    taskStatus.dataset.status = taskStatusData;
    if(taskStatus.dataset.status == "checked")
        taskStatus.src = checkedUrl;
    else
    taskStatus.src = uncheckedUrl ;

    let removeIcon = document.createElement("img");
    removeIcon.src = removeSvgUrl;

    li.append(taskName,taskStatus,removeIcon);
    tasksContainer.append(li);

    //Save to LocalStorage

    let taskData = {
        "taskName" : newTaskName, 
        status: taskStatusData
    };
    console.log(taskData,newTaskName);
    allTasks[id] = taskData;
    

    //Added EventListeners
    taskStatus.addEventListener("click",()=>{
        console.log("hey");
        if(taskStatus.dataset.status==="unchecked"){
            taskStatus.dataset.status = "checked";
            taskStatus.src = checkedUrl;
            allTasks[id].status ="checked";
        }
        else{
            taskStatus.src = uncheckedUrl ;
            taskStatus.dataset.status = "unchecked";
            allTasks[id].status = "unchecked";
        }
        // localStorage.setItem("allTasks",JSON.stringify(allTasks));
    })


    removeIcon.addEventListener("click",()=>{
        li.remove();
        delete allTasks[id];
        // localStorage.setItem("allTasks",JSON.stringify(allTasks));
    })
    
    
    // localStorage.setItem("allTasks",JSON.stringify(allTasks));
}



if(localStorage.getItem("allTasks") !== null){
    let allPrevTasks = JSON.parse(localStorage.getItem("allTasks"));
    allkeys = Object.keys(allPrevTasks);
    if(allkeys.length>0)
    taskId= Math.max(...allkeys)+1;
    console.log(taskId)
    allkeys.forEach((key) =>{
        createTask(allPrevTasks[key].taskName , allPrevTasks[key].status,key );
    })
}


const addTask = (e)=>{
    e.preventDefault();
    let newTaskName = newTaskInput.value;
    createTask(newTaskName);
    newTaskInput.value="";
}


taskForm.addEventListener("submit",addTask);

addEventListener("unload",()=>{
    localStorage.setItem("allTasks",JSON.stringify(allTasks));
})
