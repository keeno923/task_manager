import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './index.css';

function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Tasks Database (Array of Objects)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('schoolSystemData');
    return saved ? JSON.parse(saved) : [];
  });

  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Form State (Holds the values of the inputs)
  const initialFormState = {
    id: null,
    date: '',
    activity: '',
    person: '',
    evaluation: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('schoolSystemData', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // --- HANDLERS ---

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 1. ADD / CREATE
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.date || !formData.activity || !formData.person) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in Date, Activity, and Person in Charge.',
      });
      return;
    }

    if (isEditing) {
      // UPDATE LOGIC
      setTasks(tasks.map(task => 
        task.id === formData.id ? formData : task
      ));
      setIsEditing(false);
      Swal.fire('Updated!', 'Activity details have been updated.', 'success');
    } else {
      // ADD LOGIC
      const newTask = { ...formData, id: Date.now() };
      setTasks([newTask, ...tasks]);
      Swal.fire({
        icon: 'success',
        title: 'Added',
        text: 'New activity record created.',
        timer: 2000,
        showConfirmButton: false
      });
    }

    // Reset Form
    setFormData(initialFormState);
  };

  // 2. EDIT (Load data into form)
  const handleEdit = (task) => {
    setFormData(task);
    setIsEditing(true);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Record?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter(task => task.id !== id));
        Swal.fire('Deleted!', 'Record has been removed.', 'success');
      }
    });
  };

  // Cancel Edit
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialFormState);
  };

  // --- RENDER TABS ---
  const renderContent = () => {
    switch(activeTab) {
      case 'objectives':
        return (
          <div>
            <h2>System Objectives</h2>
            <hr style={{margin:'15px 0', opacity:0.2}}/>
            <div className="card">
              <h3>1. Centralized Management</h3>
              <p>To provide a school-wide platform for tracking activities, ensuring accountability for the "Person in Charge."</p>
            </div>
            <div className="card">
              <h3>2. Record Keeping</h3>
              <p>To maintain a digital log of dates and evaluations for future accreditation and reporting purposes.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2>System Configuration</h2>
            <hr style={{margin:'15px 0', opacity:0.2}}/>
            <div className="card">
              <h3>Visual Preferences</h3>
              <button 
                className={`btn ${darkMode ? 'btn-success' : 'btn-secondary'}`} 
                onClick={() => setDarkMode(!darkMode)}
                style={{marginTop: '10px'}}
              >
                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
            <div className="card" style={{borderColor: '#c0392b'}}>
              <h3 style={{color: '#c0392b'}}>Danger Zone</h3>
              <p>Delete all records from the database permanently.</p>
              <button className="btn btn-danger" onClick={() => {
                 Swal.fire({ title: 'Wipe Database?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, Wipe' })
                 .then((r) => { if(r.isConfirmed) { setTasks([]); localStorage.removeItem('schoolSystemData'); }});
              }} style={{marginTop: '10px'}}>
                Reset System Database
              </button>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div>
            <h2>Activity Management Dashboard</h2>
            <p style={{marginBottom: '20px', opacity: 0.7}}>School Year 2024-2025</p>

            {/* --- INPUT FORM --- */}
            <div className="form-container">
              <h4 style={{marginBottom:'15px', color: 'var(--accent)'}}>
                {isEditing ? 'Update Existing Record' : 'Add New Activity'}
              </h4>
              
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Activity Date:</label>
                    <input 
                      type="date" 
                      name="date" 
                      className="form-control"
                      value={formData.date} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Activity Name:</label>
                    <input 
                      type="text" 
                      name="activity" 
                      placeholder="Ex: IT Week Celebration" 
                      className="form-control"
                      value={formData.activity} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Person In Charge:</label>
                    <input 
                      type="text" 
                      name="person" 
                      placeholder="Ex: Mr. Juan Dela Cruz" 
                      className="form-control"
                      value={formData.person} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Evaluation / Status:</label>
                    <select 
                      name="evaluation" 
                      className="form-control"
                      value={formData.evaluation} 
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status...</option>
                      <option value="Pending">Pending</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Successful">Successful</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="btn-group">
                  <button type="submit" className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                    {isEditing ? 'Update Record' : 'Save Record'}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* --- DATA TABLE --- */}
            <div style={{overflowX: 'auto'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th width="15%">Date</th>
                    <th width="30%">Activity Name</th>
                    <th width="20%">Person In Charge</th>
                    <th width="15%">Evaluation</th>
                    <th width="20%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '30px', opacity: 0.6}}>
                        No records found in the database.
                      </td>
                    </tr>
                  ) : (
                    tasks.map(task => (
                      <tr key={task.id}>
                        <td>{task.date}</td>
                        <td style={{fontWeight: 'bold'}}>{task.activity}</td>
                        <td>{task.person}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            backgroundColor: 
                              task.evaluation === 'Successful' ? '#d4edda' : 
                              task.evaluation === 'Pending' ? '#fff3cd' : 
                              task.evaluation === 'Cancelled' ? '#f8d7da' : '#e2e3e5',
                            color: 
                              task.evaluation === 'Successful' ? '#155724' : 
                              task.evaluation === 'Pending' ? '#856404' : 
                              task.evaluation === 'Cancelled' ? '#721c24' : '#383d41'
                          }}>
                            {task.evaluation || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-warning" 
                            style={{padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px'}}
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{padding: '5px 10px', fontSize: '0.8rem'}}
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        );
    }
  };

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
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </li>
            <li className={activeTab === 'objectives' ? 'active' : ''} onClick={() => setActiveTab('objectives')}>
              System Objectives
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      <footer>
        <p>Final Project in IT Elective I | System Generated Report</p>
        <p><strong>Submitted to:</strong> MR. LINCOLN V. VINUYA, MIT, LPT</p>
      </footer>
    </div>
  );
}

export default App;