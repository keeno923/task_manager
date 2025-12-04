import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './index.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('myProjectTasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Inputs State
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // --- EFFECTS ---
  
  // Save Tasks
  useEffect(() => {
    localStorage.setItem('myProjectTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle Dark Mode
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // --- FUNCTIONS ---

  // 1. Add Task
  const addTask = () => {
    if (!inputText.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Task cannot be empty!',
      });
      return;
    }
    
    const newTask = { id: Date.now(), text: inputText, completed: false };
    setTasks([newTask, ...tasks]);
    setInputText('');
    
    // Toast Notification
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({ icon: 'success', title: 'Task added successfully' });
  };

  // 2. Toggle Complete
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // 3. Delete Task
  const deleteTask = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#34495e',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter(task => task.id !== id));
        Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
      }
    });
  };

  // 4. Start Editing
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  // 5. Save Edit
  const saveEdit = () => {
    if (!editText.trim()) return;
    setTasks(tasks.map(task => 
      task.id === editingId ? { ...task, text: editText } : task
    ));
    setEditingId(null);
    Swal.fire({ icon: 'success', title: 'Task Updated', timer: 1500, showConfirmButton: false });
  };

  // --- RENDER CONTENT BASED ON TAB ---
  const renderContent = () => {
    switch(activeTab) {
      case 'objectives':
        return (
          <div>
            <h2>Project Objectives</h2>
            <p style={{marginBottom: '20px', opacity: 0.7}}>Goals for IT Elective I</p>
            
            <div className="card">
              <h3>1. Mastery of React</h3>
              <p>To understand the component-based architecture and state management hooks like useState and useEffect.</p>
            </div>
            <div className="card">
              <h3>2. Data Persistence</h3>
              <p>To implement LocalStorage so data remains available even after the browser is closed, simulating a database.</p>
            </div>
            <div className="card">
              <h3>3. User Experience (UX)</h3>
              <p>To create a responsive interface with visual feedback (SweetAlert) and Theme customization (Dark Mode).</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2>System Settings</h2>
            <p style={{marginBottom: '20px', opacity: 0.7}}>Configure your workspace</p>
            
            <div className="card">
              <h3>Appearance</h3>
              <br/>
              <div className="toggle-switch" onClick={() => setDarkMode(!darkMode)}>
                <div style={{
                  width: '50px', height: '24px', background: darkMode ? '#2ecc71' : '#ccc',
                  borderRadius: '12px', position: 'relative', transition: '0.3s'
                }}>
                  <div style={{
                    width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                    position: 'absolute', top: '2px', left: darkMode ? '28px' : '2px', transition: '0.3s'
                  }}></div>
                </div>
                <span>{darkMode ? 'Dark Mode On' : 'Light Mode On'}</span>
              </div>
            </div>

            <div className="card">
              <h3>Data Management</h3>
              <br/>
              <button className="action-btn delete-btn" onClick={() => {
                 Swal.fire({
                  title: 'Clear All Data?',
                  text: "This will remove all tasks permanently!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, clear all!'
                }).then((r) => {
                  if(r.isConfirmed) {
                    setTasks([]);
                    localStorage.removeItem('myProjectTasks');
                    Swal.fire('Cleared', 'Database reset.', 'success');
                  }
                });
              }}>Reset Application Data</button>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div>
            <h2>Main Dashboard</h2>
            <p style={{marginBottom: '20px', opacity: 0.7}}>Manage your tasks efficiently.</p>

            <div className="input-group">
              <input 
                type="text" 
                placeholder="Enter a new task..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <button className="add-btn" onClick={addTask}>Add Task</button>
            </div>

            <ul className="task-list">
              {tasks.length === 0 && <p style={{fontStyle:'italic', opacity:0.6}}>No tasks found. Add one to get started!</p>}
              
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  
                  {/* EDIT MODE */}
                  {editingId === task.id ? (
                    <>
                      <input 
                        type="text" 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)}
                        style={{flex: 1, marginRight: '10px'}}
                      />
                      <button className="action-btn save-btn" onClick={saveEdit}>Save</button>
                      <button className="action-btn cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                  /* VIEW MODE */
                    <>
                      <div className="task-content" onClick={() => toggleComplete(task.id)}>
                        <input type="checkbox" checked={task.completed} readOnly />
                        <span>{task.text}</span>
                      </div>
                      <div>
                        <button className="action-btn edit-btn" onClick={() => startEdit(task)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  // --- MAIN LAYOUT RENDER ---
  return (
    <div className="app-wrapper">
      <header>
        <h1>UNIVERSITY OF THE ASSUMPTION</h1>
        <h2>College of Information Technology</h2>
        <p>Del Pilar, City of San Fdo. Pampanga</p>
      </header>

      <div className="container">
        <nav className="sidebar">
          <h3>IT Elective I</h3>
          <ul>
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('dashboard')}
            >
               Dashboard
            </li>
            <li 
              className={activeTab === 'objectives' ? 'active' : ''} 
              onClick={() => setActiveTab('objectives')}
            >
               Objectives
            </li>
            <li 
              className={activeTab === 'settings' ? 'active' : ''} 
              onClick={() => setActiveTab('settings')}
            >
               Settings
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      <footer>
        <p>Final Project in IT Elective I</p>
        <p><strong>Submitted to:</strong> MR. LINCOLN V. VINUYA, MIT, LPT</p>
        <p>College Lecturer</p>
      </footer>
    </div>
  );
}

export default App;