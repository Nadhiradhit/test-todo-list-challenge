const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const showIncompleteOnlyCheckbox =
	document.getElementById("showIncompleteOnly");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
	const taskText = taskInput.value.trim();
	if (taskText === "") return;

	const task = {
		text: taskText,
		completed: false,
		createdAt: new Date().toISOString(),
		completedAt: null,
	};

	tasks.push(task);
	taskInput.value = "";
	saveTasks();
	renderTasks();
}

function renderTasks() {
	taskList.innerHTML = "";
	const currentFilter = filter.value;
	const showIncompleteOnly = showIncompleteOnlyCheckbox?.checked;

	const filteredTasks = tasks
		.map((task, originalIndex) => ({ task, originalIndex }))
		.filter(({ task }) => {
			if (showIncompleteOnly && task.completed) return false;
			if (currentFilter === "completed") return task.completed;
			if (currentFilter === "uncompleted") return !task.completed;
			return true;
		});

	filteredTasks.forEach(({ task, originalIndex }) => {
		const li = document.createElement("li");
		const container = document.createElement("div");
		container.className = "task-container";

		// Checkbox
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = task.completed;
		checkbox.addEventListener("change", () => toggleTask(originalIndex));

		// Task text
		const textSpan = document.createElement("span");
		textSpan.className = "task-text";
		textSpan.textContent = task.text;
		textSpan.style.textDecoration = task.completed ? "line-through" : "none";
		textSpan.classList.toggle("completed", task.completed);

		// Delete button
		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "Delete";
		deleteBtn.style.marginLeft = "10px";
		deleteBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			deleteTask(originalIndex);
		});

		container.appendChild(checkbox);
		container.appendChild(textSpan);
		container.appendChild(deleteBtn);
		li.appendChild(container);
		taskList.appendChild(li);
	});
}

function toggleTask(index) {
	tasks[index].completed = !tasks[index].completed;
	tasks[index].completedAt = tasks[index].completed
		? new Date().toISOString()
		: null;
	saveTasks();
	renderTasks();
}

function deleteTask(index) {
	tasks.splice(index, 1);
	saveTasks();
	renderTasks();
}

function clearAllTasks() {
	if (tasks.length === 0) return;

	if (confirm("Are you sure you want to delete all tasks?")) {
		tasks = [];
		saveTasks();
		renderTasks();
	}
}

renderTasks();
