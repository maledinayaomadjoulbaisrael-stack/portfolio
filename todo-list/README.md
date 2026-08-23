# To-Do List Application

A modern, feature-rich to-do list application with local storage functionality. Stay organized and productive!

## 🎯 Features

### Core Functionality
✅ **Add Tasks** - Quickly add new tasks with a single click
✅ **Mark Complete** - Check off tasks as you complete them
✅ **Delete Tasks** - Remove individual tasks or clear all at once
✅ **Local Storage** - All tasks are automatically saved to your browser

### Filtering & Organization
🔍 **Filter Tasks** - View All, Active, or Completed tasks
📊 **Statistics** - See total, completed, and remaining task counts
🏷️ **Priority Levels** - Organize tasks by priority (High, Medium, Low)
📅 **Date Tracking** - Each task shows when it was created

### User Experience
💾 **Auto-Save** - Changes are automatically saved to local storage
🎨 **Beautiful UI** - Modern, responsive design with smooth animations
📱 **Mobile Friendly** - Works perfectly on phones, tablets, and desktops
🔔 **Notifications** - Toast messages for user actions
⌨️ **Keyboard Shortcuts** - Quick keyboard navigation

### Advanced Features
🗑️ **Clear Completed** - Remove all completed tasks at once
🧹 **Clear All** - Reset your entire task list
⚠️ **Confirmation Modal** - Confirmation dialogs for destructive actions
♿ **Accessible** - Built with accessibility in mind
🎯 **Keyboard Shortcuts** - Ctrl/Cmd+N to focus input, Escape to unfocus

## 🚀 Getting Started

### Option 1: Direct File Usage
1. Download or copy the three files:
   - `index.html`
   - `style.css`
   - `script.js`

2. Place them in a folder

3. Open `index.html` in your web browser

### Option 2: GitHub Pages
1. Fork or clone this repository
2. Push to GitHub
3. Enable GitHub Pages in repository settings
4. Access at `https://yourusername.github.io/repo-name/todo-list/`

## 📖 How to Use

### Adding Tasks
1. Type your task in the input field
2. Click "Add Task" button or press Enter
3. Task appears in your list

### Managing Tasks
- **Complete a Task**: Click the checkbox next to the task
- **Delete a Task**: Click the trash icon
- **Filter Tasks**: Use the filter buttons (All, Active, Completed)

### Bulk Actions
- **Clear Completed**: Remove all completed tasks
- **Clear All**: Delete all tasks (requires confirmation)

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Focus on the input field
- `Escape`: Unfocus from input field
- `Enter`: Add task from input field

## 💾 Local Storage Details

### How It Works
- Your tasks are automatically saved to your browser's local storage
- Data persists even after closing the browser
- All tasks are stored as JSON in your browser's storage

### Storage Key
- `todoList_tasks` - Where all your tasks are stored

### Storage Capacity
- Modern browsers support 5-10 MB of local storage
- You can safely store thousands of tasks

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 600px to 1200px
- **Mobile**: Below 600px
- **Small Mobile**: Below 400px

## 🎨 Customization

### Change Colors
Edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #4f46e5;      /* Main color */
    --success-color: #10b981;      /* Success messages */
    --danger-color: #ef4444;       /* Delete/danger */
    --warning-color: #f59e0b;      /* Warning */
    /* ... other colors ... */
}
```

### Change Font
Replace the font-family in `style.css`:

```css
body {
    font-family: 'Your Font Name', sans-serif;
}
```

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables and animations
- **JavaScript (ES6+)** - OOP with class-based architecture
- **Local Storage API** - Browser data persistence

### Browser Compatibility
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

### Local Storage Implementation
```javascript
// Save
localStorage.setItem('todoList_tasks', JSON.stringify(todos));

// Load
const todos = JSON.parse(localStorage.getItem('todoList_tasks'));
```

## 🛡️ Data Security

### Security Measures
- ✅ HTML escaping to prevent XSS attacks
- ✅ Input validation
- ✅ Safe JSON parsing with error handling
- ✅ Confirmation dialogs for destructive actions

### Data Privacy
- All data is stored locally in your browser
- No data is sent to any server
- No tracking or analytics
- Complete privacy and control

## 📊 Statistics

The app tracks:
- **Total Tasks**: Total number of tasks
- **Completed**: Number of completed tasks
- **Remaining**: Number of active tasks

## ⌨️ Advanced Features

### Task Properties
Each task contains:
```javascript
{
    id: timestamp,           // Unique identifier
    text: "Task description", // Task text
    completed: false,        // Completion status
    priority: "medium",      // Priority level
    createdAt: "MM/DD/YYYY" // Creation date
}
```

### Priority Levels
- 🔴 **High** - Red badge
- 🟡 **Medium** - Yellow badge
- 🔵 **Low** - Blue badge

## 🐛 Troubleshooting

### Tasks Not Saving?
- Check if local storage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Tasks Not Appearing?
- Refresh the page
- Check if JavaScript is enabled
- Try a different browser

### Local Storage Full?
- Clear completed tasks
- Export and backup your tasks
- Clear all tasks and start fresh

## 📸 Screenshots

### Main View
- Clean interface with input field
- Filter buttons for task organization
- Statistics showing task progress

### Task List
- Checkboxes for completion
- Priority badges
- Creation dates
- Delete buttons

### Mobile View
- Responsive design
- Touch-friendly buttons
- Optimized layout

## 🎓 Learning Resources

### JavaScript Concepts Used
- ES6 Classes
- Local Storage API
- Event Listeners
- DOM Manipulation
- Array Methods (filter, map, find)
- Error Handling

### Useful Links
- [MDN Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

## 💡 Future Enhancements

Potential features to add:
- [ ] Due dates with reminders
- [ ] Task categories/tags
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Drag and drop reordering
- [ ] Recurring tasks
- [ ] Cloud sync
- [ ] Subtasks
- [ ] Task notes/descriptions
- [ ] Statistics charts

## 📝 License

Feel free to use and modify this project for personal or commercial use.

## 🤝 Contributing

Want to improve this app?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please create an issue on GitHub or contact the maintainer.

---

**Made with ❤️ for productivity**

Happy organizing! 🎉