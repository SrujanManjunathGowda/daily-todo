const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const progressCount = document.getElementById("progressCount");

const taskCount = document.getElementById("taskCount");
const dateElement = document.getElementById("date");
const themeBtn = document.getElementById("themeBtn");
const motivation = document.getElementById("motivation");
const streakElement = document.getElementById("streak");

let tasks = JSON.parse(localStorage.getItem("dailyTasks")) || [];
let streak = Number(localStorage.getItem("todoStreak")) || 0;


// SHOW DATE
function showDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString("en-IN", options);
}


// SAVE TASKS
function saveTasks() {

    localStorage.setItem(
        "dailyTasks",
        JSON.stringify(tasks)
    );
}


// ADD TASK
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// DISPLAY TASKS
function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";
    }


    tasks.forEach(function(task) {

        const taskElement = document.createElement("div");

        taskElement.className = "task";


        if (task.completed) {
            taskElement.classList.add("completed");
        }


        // CHECKBOX
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "checkbox";

        checkbox.checked = task.completed;


        // TASK TEXT
        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // EDIT BUTTON
        const editButton = document.createElement("button");

        editButton.className = "edit-btn";

        editButton.textContent = "✏️";


        // DELETE BUTTON
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "🗑️";


        // CHECKBOX EVENT
        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


        // EDIT EVENT
        editButton.addEventListener("click", function() {

            editTask(task.id);

        });


        // DELETE EVENT
        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        taskElement.appendChild(checkbox);

        taskElement.appendChild(taskText);

        taskElement.appendChild(editButton);

        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);

    });


    updateProgress();
}


// TOGGLE TASK
function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateStreak();
}


// DELETE TASK
function deleteTask(id) {

    const confirmation =
        confirm("Delete this task?");


    if (!confirmation) {
        return;
    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();
}


// EDIT TASK
function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const newText =
        prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    if (newText.trim() === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.text = newText.trim();

    saveTasks();

    renderTasks();
}


// UPDATE PROGRESS
function updateProgress() {

    const total = tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }


    progressText.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    progressCount.textContent =
        completed + "/" + total;


    if (total === 0) {

        taskCount.textContent = "0 tasks";

    } else if (total === 1) {

        taskCount.textContent = "1 task";

    } else {

        taskCount.textContent =
            total + " tasks";

    }


    if (percentage === 0) {

        motivation.textContent =
            "Let's make today productive! 💪";

    } else if (percentage < 50) {

        motivation.textContent =
            "Good start! Keep going. 🔥";

    } else if (percentage < 100) {

        motivation.textContent =
            "You're doing great! Almost there! 🚀";

    } else {

        motivation.textContent =
            "Amazing! You completed everything! 🏆";

    }
}


// UPDATE STREAK
function updateStreak() {

    const total = tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    if (total > 0 && completed === total) {

        const today =
            new Date().toDateString();


        const lastCompleted =
            localStorage.getItem("lastCompletedDate");


        if (lastCompleted !== today) {

            streak++;

            localStorage.setItem(
                "todoStreak",
                streak
            );

            localStorage.setItem(
                "lastCompletedDate",
                today
            );
        }
    }


    streakElement.textContent = streak;
}


// DARK MODE
themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    const darkMode =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "darkMode",
        darkMode
    );


    if (darkMode) {

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }

});


// LOAD DARK MODE
function loadTheme() {

    const darkMode =
        localStorage.getItem("darkMode");


    if (darkMode === "true") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    }

}


// ADD BUTTON
addBtn.addEventListener("click", addTask);


// ENTER KEY
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// START APP
showDate();

loadTheme();

renderTasks();

updateStreak();