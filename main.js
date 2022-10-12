const taskInput = document.querySelector(".task-input input"),
      taskBox = document.querySelector(".task-box"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn");

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

 filters.forEach(btn =>{
    btn.addEventListener("click", ()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
 });

 function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                      <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class = "${isCompleted}">${todo.name}</p>
                      </label>
                      <div class="settings">
                           <i onclick = "showMenu(this)" class='bx bx-dots-horizontal-rounded' ></i>
                            <ul class="task-menu">
                                <li onclick = "editTask(${id}, '${todo.name}')"><i class='bx bx-pencil' ></i> Edit</li>
                                <li onclick = "deleteTask(${id}, '${filter}')"><i class='bx bx-trash' ></i> Delete</li>
                            </ul>
                      </div>
                  </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>you don't have tasks here.</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");

 };

 showTodo("all");

 function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
 };

 function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "Pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
 }

 function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");
 };

 function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
 };

 clearAll.addEventListener("click", ()=>{
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
 });

taskInput.addEventListener("keyup", e =>{
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo) //adding new task to todos
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});