import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { taskAPI } from '../services/api';

function TaskForm({ setAuth }) {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getTaskById(id);
      const task = response.data;
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        dueDate: task.dueDate || '',
      });
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Failed to load task');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null,
      };

      if (isEditMode) {
        await taskAPI.updateTask(id, data);
      } else {
        await taskAPI.createTask(data);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="container">
        <div className="card task-form">
          <h2>{isEditMode ? 'Edit Task' : 'Create Task'}</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;