let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

document.getElementById("addBtn").addEventListener("click", addTask);

function addTask() {
    const text = taskInput.value.trim();

    if(text === "") {
        alert("Enter a task");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if(currentFilter === "active")
            return !task.completed;

        if(currentFilter === "completed")
            return task.completed;

        return true;
    });

    const searchText = searchInput.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div class="task-buttons">
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function toggleTask(id){
    tasks = tasks.map(task =>
        task.id === id
        ? {...task, completed: !task.completed}
        : task
    );

    saveTasks();
    renderTasks();
}

function editTask(id){

    const task = tasks.find(task => task.id === id);

    const newText = prompt("Edit Task", task.text);

    if(newText){
        task.text = newText;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id){

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function filterTasks(type){
    currentFilter = type;
    renderTasks();
}

function updateStats(){

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("total").textContent = total;
    document.getElementById("completed").textContent = completed;
    document.getElementById("pending").textContent = pending;
}

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

searchInput.addEventListener("input", renderTasks);

document.getElementById("clearCompleted")
.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

renderTasks();
