// ===========================
// TODO LIST APPLICATION
// With Local Storage Functionality
// ===========================

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoList_tasks';
        this.init();
    }

    // Initialize the app
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Input and Add button
        const input = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');

        addBtn.addEventListener('click', () => this.addTodo(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo(input.value);
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.filter-btn').classList.add('active');
                this.currentFilter = e.target.closest('.filter-btn').dataset.filter;
                this.render();
            });
        });

        // Action buttons
        document.getElementById('clearCompletedBtn').addEventListener('click', () => {
            this.showConfirmModal('Clear all completed tasks?', () => this.clearCompleted());
        });

        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.showConfirmModal('Delete all tasks? This cannot be undone.', () => this.clearAll());
        });

        // Modal buttons
        document.getElementById('confirmBtn').addEventListener('click', () => {
            if (this.confirmCallback) {
                this.confirmCallback();
                this.closeModal();
            }
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on background click
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') {
                this.closeModal();
            }
        });
    }

    // Add a new todo
    addTodo(text) {
        const input = document.getElementById('todoInput');
        const trimmedText = text.trim();

        if (!trimmedText) {
            this.showToast('Please enter a task', 'error');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: trimmedText,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleDateString()
        };

        this.todos.push(newTodo);
        this.saveToStorage();
        input.value = '';
        input.focus();
        this.render();
        this.showToast('Task added successfully!', 'success');
    }

    // Toggle todo completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // Delete a todo
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        this.showToast('Task deleted', 'success');
    }

    // Clear completed todos
    clearCompleted() {
        const initialCount = this.todos.length;
        this.todos = this.todos.filter(t => !t.completed);
        const deletedCount = initialCount - this.todos.length;

        if (deletedCount > 0) {
            this.saveToStorage();
            this.render();
            this.showToast(`${deletedCount} completed task(s) deleted`, 'success');
        } else {
            this.showToast('No completed tasks to delete', 'error');
        }
    }

    // Clear all todos
    clearAll() {
        const initialCount = this.todos.length;
        this.todos = [];
        this.saveToStorage();
        this.render();
        this.showToast(`All ${initialCount} task(s) deleted`, 'success');
    }

    // Get filtered todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // Update statistics
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = remaining;
    }

    // Render the UI
    render() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        // Clear current list
        tasksList.innerHTML = '';

        // Show empty state if no tasks
        if (this.todos.length === 0) {
            emptyState.style.display = 'flex';
            tasksList.style.display = 'none';
        } else if (filteredTodos.length === 0) {
            emptyState.innerHTML = `
                <i class="fas fa-filter"></i>
                <p>No ${this.currentFilter} tasks</p>
            `;
            emptyState.style.display = 'flex';
            tasksList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            tasksList.style.display = 'block';

            filteredTodos.forEach(todo => {
                const taskElement = this.createTaskElement(todo);
                tasksList.appendChild(taskElement);
            });
        }

        this.updateStats();
    }

    // Create a task element
    createTaskElement(todo) {
        const div = document.createElement('div');
        div.className = `task-item ${todo.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="todoApp.toggleTodo(${todo.id})"
            >
            <span class="task-text">${this.escapeHtml(todo.text)}</span>
            <span class="task-priority priority-${todo.priority}">${todo.priority}</span>
            <span class="task-date">${todo.createdAt}</span>
            <button class="task-delete" onclick="todoApp.deleteTodo(${todo.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        return div;
    }

    // Show confirmation modal
    showConfirmModal(message, callback) {
        this.confirmCallback = callback;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('confirmModal').classList.add('show');
    }

    // Close modal
    closeModal() {
        document.getElementById('confirmModal').classList.remove('show');
        this.confirmCallback = null;
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Save to local storage
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showToast('Failed to save tasks', 'error');
        }
    }

    // Load from local storage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.todos = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.todos = [];
        }
    }

    // Escape HTML characters for security
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Export todos as JSON
    exportToJSON() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import todos from JSON
    importFromJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.todos = imported;
                    this.saveToStorage();
                    this.render();
                    this.showToast('Tasks imported successfully!', 'success');
                } else {
                    this.showToast('Invalid file format', 'error');
                }
            } catch (error) {
                this.showToast('Error importing file', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Allow pressing Enter in input field
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todoInput');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('addBtn').click();
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: Focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
    // Escape: Unfocus input
    if (e.key === 'Escape') {
        document.getElementById('todoInput').blur();
    }
});

console.log('%c📝 To-Do List App Loaded!', 'color: #4f46e5; font-size: 16px; font-weight: bold;');
console.log('%cUse Ctrl+N to focus input, or press Escape to unfocus', 'color: #666; font-size: 12px;');