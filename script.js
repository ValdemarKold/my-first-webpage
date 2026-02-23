const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

const API_URL = 'http://localhost:5000/todos';

// Load tasks from API when page loads
loadTasks();

addButton.addEventListener('click', function() {
    addTask();
});

todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = todoInput.value.trim();
    const priority = prioritySelect.value;
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        text: taskText,
        priority: priority,
        completed: false,
        id: Date.now()
    };
    
    // Send task to API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
        createTaskElement(data);
        todoInput.value = '';
        todoInput.focus();
    })
    .catch(error => {
        console.error('Error adding task:', error);
        alert('Failed to add task');
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'todo-item priority-' + task.priority;
    li.dataset.id = task.id;
    li.dataset.priority = task.priority;
    
    if (task.completed) {
        li.classList.add('completed');
    }
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const badge = document.createElement('span');
    badge.className = 'priority-badge ' + task.priority;
    badge.textContent = task.priority;
    
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;
    
    taskContent.appendChild(badge);
    taskContent.appendChild(taskSpan);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id, li);
    });
    
    li.addEventListener('click', function(event) {
        if (event.target !== deleteBtn) {
            li.classList.toggle('completed');
            // You could add an API call here to update completion status
        }
    });
    
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
}

function loadTasks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(tasks => {
            todoList.innerHTML = ''; // Clear existing tasks
            tasks.forEach(task => {
                createTaskElement(task);
            });
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
        });
}

function deleteTask(taskId, element) {
    fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            element.remove();
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    });
}
