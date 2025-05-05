const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
let tasks = [];
let currentFilter = 'all'; //default filter

// load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

function addTask() {
	const taskText = taskInput.value;
	if (taskText === "") return;

	const task = {
		id: Date.now(), //id unik untuk task
		text: taskText,
		completed: false,
		createdAt: new Date(), 
	};

	tasks.push(task);
	saveTasksToLocalStorage(); //implementasi function saveTasksToLocalStorage
	renderTasks();
	taskInput.value = ""; // menambahkan input reset setelah masuk task
}

function renderTasks() {
	taskList.innerHTML = "";
	tasks.forEach((task, index) => {
		const li = document.createElement("li");
		li.textContent = task.text; 
		if ((task.completed === true)) { //memperbaiki operator perbandingan = menjadi ===
			li.style.textDecoration = "line-through";
		}

		li.addEventListener("click", () => toggleTask(index));
		taskList.appendChild(li);
	});
}

function toggleTask(index) {
	tasks[index].completed = !tasks[index].completed;
	renderTasks();
}

function saveTasksToLocalStorage(){
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage(){
	const saveTasks = localStorage.getItem('tasks');
	
	if (saveTasks){
		tasks = JSON.parse(saveTasks);
		renderTasks();
	}
}
