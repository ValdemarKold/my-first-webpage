const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

// Get username from localStorage or prompt user
let currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    currentUser = prompt('Enter your username:');
    if (currentUser) {
        localStorage.setItem('currentUser', currentUser);
    } else {
        currentUser = 'guest';
    }
}

const API_URL = `http://localhost:5000/todos/${currentUser}`;

// Display current user
document.querySelector('h1').textContent = `${currentUser}'s To-Do List`;

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
    
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task added:', data);
        createTaskElement(data);
        todoInput.value = '';
        todoInput.focus();
    })
    .catch(error => {
        console.error('Error adding task:', error);
        alert('Failed to add task. Is the API server running?');
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
            
            const isCompleted = li.classList.contains('completed');
            fetch(`http://localhost:5000/todos/${currentUser}/${task.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: isCompleted })
            })
            .then(response => response.json())
            .then(data => console.log('Task updated:', data))
            .catch(error => console.error('Error updating task:', error));
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
            console.log('Loaded tasks:', tasks);
            todoList.innerHTML = '';
            tasks.forEach(task => {
                createTaskElement(task);
            });
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
        });
}

function deleteTask(taskId, element) {
    fetch(`http://localhost:5000/todos/${currentUser}/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Task deleted:', taskId);
            element.remove();
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    });
}

// Add logout button functionality
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Switch User';
logoutBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;';
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    location.reload();
});
document.body.appendChild(logoutBtn);
