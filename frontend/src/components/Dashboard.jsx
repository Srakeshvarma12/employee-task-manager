import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import TaskCard from './TaskCard';
import { taskAPI } from '../services/api';

function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ totalTasks: 0, todoTasks: 0, inProgressTasks: 0, completedTasks: 0 });
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchSummary();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const filterParams = {};
      if (filters.status) filterParams.status = filters.status;
      if (filters.priority) filterParams.priority = filters.priority;

      const response = await taskAPI.getAllTasks(filterParams);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await taskAPI.getTaskSummary();
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      fetchTasks();
      fetchSummary();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(taskId);
      fetchTasks();
      fetchSummary();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="count">{summary.totalTasks}</div>
          </div>
          <div className="stat-card">
            <h3>To Do</h3>
            <div className="count">{summary.todoTasks}</div>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <div className="count">{summary.inProgressTasks}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="count">{summary.completedTasks}</div>
          </div>
        </div>

        <div className="filters">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
            Create Task
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onEdit={() => navigate(`/tasks/edit/${task.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;