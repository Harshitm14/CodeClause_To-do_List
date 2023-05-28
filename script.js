// Load tasks from local storage when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      addTask(task.task, task.priority, task.completed, false);
    });
  }
});

// Add task to the list and store in local storage
function addTask(task, priority, completed = false, store = true) {
  const listItem = document.createElement('li');
  listItem.classList.add('task', priority + '-priority');

  const completeButton = document.createElement('button');
  completeButton.classList.add('complete-button');
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.addEventListener('click', completeTask);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener('click', deleteTask);

  const taskText = document.createElement('span');
  taskText.textContent = task;
  if (completed) {
    listItem.classList.add('completed');
  }

  listItem.appendChild(completeButton);
  listItem.appendChild(deleteButton);
  listItem.appendChild(taskText);

  document.getElementById('todo-list').appendChild(listItem);

  if (store) {
    // Store task in local storage
    const taskObject = {
      task: task,
      priority: priority,
      completed: completed
    };

    const storedTasks = localStorage.getItem('tasks');
    let tasks = [];
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
    tasks.push(taskObject);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Complete task and update local storage
function completeTask() {
  const listItem = this.parentNode;
  listItem.classList.toggle('completed');

  const taskText = listItem.querySelector('span').textContent;

  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    const taskIndex = tasks.findIndex((item) => item.task === taskText);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
}

// Delete task and update local storage
function deleteTask() {
  const listItem = this.parentNode;
  listItem.remove();

  const taskText = listItem.querySelector('span').textContent;

  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    const taskIndex = tasks.findIndex((item) => item.task === taskText);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
}

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const inputField = document.getElementById('todo-input');
  const prioritySelect = document.getElementById('priority-select');

  const task = inputField.value;
  const priority = prioritySelect.value;

  if (task === '' || priority === '') {
    return;
  }

  // Check if the task already exists in the list
  const taskExists = Array.from(document.getElementsByClassName('task')).some((taskElement) => {
    const taskText = taskElement.querySelector('span').textContent;
    return taskText === task;
  });

  if (!taskExists) {
    addTask(task, priority);

    inputField.value = '';
    prioritySelect.value = '';
  }
});
// Filter the list based on the selected priority
document.getElementById('filter-select').addEventListener('change', () => {
  const filterValue = document.getElementById('filter-select').value;
  const listItems = document.getElementsByClassName('task');

  Array.from(listItems).forEach((item) => {
      if (filterValue === 'all' || item.classList.contains(filterValue + '-priority')) {
          item.style.display = 'block';
      } else {
          item.style.display = 'none';
      }
  });
});
