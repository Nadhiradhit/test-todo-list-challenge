const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
	const taskText = taskInput.value.trim();
	if (taskText === "") return;

	const task = {
		text: taskText,
		completed: false,
		createdAt: new Date(),
		completedAt: null
	};

	tasks.push(task);
	taskInput.value = "";
	saveTasks();
	renderTasks();
}

function renderTasks() {
	taskList.innerHTML = "";
	const currentFilter = filter.value;

	const filteredTasks = tasks
		.map((task, originalIndex) => ({ task, originalIndex }))
		.filter(({ task }) => {
			if (currentFilter === 'completed') return task.completed;
			if (currentFilter === 'uncompleted') return !task.completed;
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

		container.appendChild(checkbox);
		container.appendChild(textSpan);
		li.appendChild(container);
		taskList.appendChild(li);
	});
}

// Initial load
renderTasks();