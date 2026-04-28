function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'TODO':
        return 'todo';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'DONE':
        return 'done';
      default:
        return '';
    }
  };

  const getPriorityClass = (priority) => {
    return priority?.toLowerCase() || 'low';
  };

  return (
    <div className="task-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3>{task.title}</h3>
        <span className={`priority ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <p style={{ color: '#666', marginTop: '10px' }}>
        {task.description || 'No description'}
      </p>
      <div style={{ marginTop: '15px' }}>
        <span className={`status ${getStatusClass(task.status)}`}>
          {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status}
        </span>
      </div>
      <div className="meta">
        <p>Due: {formatDate(task.dueDate)}</p>
        {task.assignedToName && <p>Assigned to: {task.assignedToName}</p>}
        <p>Created by: {task.createdByName}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button className="btn btn-secondary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;