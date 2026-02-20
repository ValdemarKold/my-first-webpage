const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

// Load tasks from localStorage when page loads
loadTasks();

// Add task when button is clicked
addButton.addEventListener('click', function() {
    addTask();
});

// Add task when Enter key is pressed
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = todoInput.value.trim();
    const priority = prioritySelect.value;
    
    // Don't add empty tasks
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        text: taskText,
        priority: priority,
        completed: false,
        id: Date.now() // Unique ID based on timestamp
    };
    
    // Create the task element
    createTaskElement(task);
    
    // Save to localStorage
    saveTasks();
    
    // Clear the input
    todoInput.value = '';
    todoInput.focus();
}

function createTaskElement(task) {
    // Create new list item
    const li = document.createElement('li');
    li.className = 'todo-item priority-' + task.priority;
    li.dataset.id = task.id; // Store ID for later reference
    li.dataset.priority = task.priority; // Store priority as data attribute
    
    if (task.completed) {
        li.classList.add('completed');
    }
    
    // Create task content container
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    // Create priority badge
    const badge = document.createElement('span');
    badge.className = 'priority-badge ' + task.priority;
    badge.textContent = task.priority;
    
    // Create task text
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text'; // Add a class for easy targeting
    taskSpan.textContent = task.text;
    
    // Add badge and text to content
    taskContent.appendChild(badge);
    taskContent.appendChild(taskSpan);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    // Delete task when button is clicked
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveTasks(); // Update localStorage
    });
    
    // Toggle completed when task is clicked
    li.addEventListener('click', function(event) {
        // Don't toggle if clicking the delete button
        if (event.target !== deleteBtn) {
            li.classList.toggle('completed');
            saveTasks(); // Update localStorage
        }
    });
    
    // Add content and button to list item
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    
    // Add list item to the list
    todoList.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    const taskElements = document.querySelectorAll('.todo-item');
    
    taskElements.forEach(function(li) {
        const task = {
            id: li.dataset.id,
            text: li.querySelector('.task-text').textContent, // Use the task-text class
            priority: li.dataset.priority,
            completed: li.classList.contains('completed')
        };
        tasks.push(task);
    });
    
    // Save to localStorage as JSON string
    localStorage.setItem('todos', JSON.stringify(tasks));
}

function loadTasks() {
    // Get tasks from localStorage
    const savedTasks = localStorage.getItem('todos');
    
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(function(task) {
            createTaskElement(task);
        });
    }
}