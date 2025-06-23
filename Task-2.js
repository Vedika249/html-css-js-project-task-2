document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const userNameInput = document.getElementById('user-name');
  const userEmailInput = document.getElementById('user-email');
  const saveProfileBtn = document.getElementById('save-profile');
  const deleteProfileBtn = document.getElementById('delete-profile');
  const greetingElement = document.getElementById('greeting');
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const clearAllBtn = document.getElementById('clear-all');
  const taskCount = document.getElementById('task-count');

  // Load user profile and tasks
  loadUserProfile();
  loadTasks();

  // Event Listeners
  saveProfileBtn.addEventListener('click', saveUserProfile);
  deleteProfileBtn.addEventListener('click', deleteUserProfile);
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  clearAllBtn.addEventListener('click', clearAllTasks);

  // Save user profile
  function saveUserProfile() {
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!name || !email) {
      alert('Please fill in both name and email fields');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    localStorage.setItem('userProfile', JSON.stringify({ name, email }));
    updateGreeting(name);
    alert('Profile saved successfully!');
  }

  // Delete user profile
  function deleteUserProfile() {
    if (confirm('Are you sure you want to delete your saved profile?')) {
      localStorage.removeItem('userProfile');
      userNameInput.value = '';
      userEmailInput.value = '';
      greetingElement.textContent = '';
      userNameInput.dispatchEvent(new Event('input'));
      userEmailInput.dispatchEvent(new Event('input'));
      alert('User profile deleted successfully!');
    }
  }

  // Load user profile
  function loadUserProfile() {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    if (savedProfile.name) {
      userNameInput.value = savedProfile.name;
      userEmailInput.value = savedProfile.email || '';
      updateGreeting(savedProfile.name);

      // Trigger label animation for filled fields
      if (savedProfile.name) userNameInput.dispatchEvent(new Event('input'));
      if (savedProfile.email) userEmailInput.dispatchEvent(new Event('input'));
    }
  }

  // Update greeting message
  function updateGreeting(name) {
    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) greeting = `Good morning, ${name}!`;
    else if (hour < 18) greeting = `Good afternoon, ${name}!`;
    else greeting = `Good evening, ${name}!`;

    greetingElement.textContent = greeting;
  }

  // Add new task
  function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox">
        <span class="task-text">${taskText}</span>
      </div>
      <button class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    `;

    taskList.appendChild(taskItem);
    taskInput.value = '';

    // Add event listeners to new task
    const checkbox = taskItem.querySelector('.task-checkbox');
    const text = taskItem.querySelector('.task-text');
    const deleteBtn = taskItem.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
      text.classList.toggle('completed', checkbox.checked);
      updateTaskCount();
      saveTasks();
    });

    deleteBtn.addEventListener('click', () => {
      taskItem.classList.add('fade-out');
      setTimeout(() => {
        taskItem.remove();
        updateTaskCount();
        saveTasks();
      }, 300);
    });

    updateTaskCount();
    saveTasks();
  }

  // Clear all tasks
  function clearAllTasks() {
    if (!taskList.children.length || !confirm('Are you sure you want to clear all tasks?')) return;

    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
      task.classList.add('fade-out');
      setTimeout(() => task.remove(), 300);
    });

    setTimeout(() => {
      updateTaskCount();
      saveTasks();
    }, 350);
  }

  // Update task counter
  function updateTaskCount() {
    const total = document.querySelectorAll('.task-item').length;
    const completed = document.querySelectorAll('.task-checkbox:checked').length;
    taskCount.textContent = `${completed}/${total} tasks completed`;
  }

  // Save tasks to localStorage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
      tasks.push({
        text: task.querySelector('.task-text').textContent,
        completed: task.querySelector('.task-checkbox').checked
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Load tasks from localStorage
  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
        <div class="task-content">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
          <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        </div>
        <button class="delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      `;

      taskList.appendChild(taskItem);

      const checkbox = taskItem.querySelector('.task-checkbox');
      const text = taskItem.querySelector('.task-text');
      const deleteBtn = taskItem.querySelector('.delete-btn');

      checkbox.addEventListener('change', () => {
        text.classList.toggle('completed', checkbox.checked);
        updateTaskCount();
        saveTasks();
      });

      deleteBtn.addEventListener('click', () => {
        taskItem.classList.add('fade-out');
        setTimeout(() => {
          taskItem.remove();
          updateTaskCount();
          saveTasks();
        }, 300);
      });
    });

    updateTaskCount();
  }

  // Email validation helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
