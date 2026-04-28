import { useNavigate } from 'react-router-dom';

function Navbar({ setAuth }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  return (
    <nav className="nav">
      <h1>Employee Task Manager</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Welcome, {user.userName || 'User'}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;