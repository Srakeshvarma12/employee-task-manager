import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setIsAuthenticated} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tasks/new"
          element={
            isAuthenticated ? <TaskForm setAuth={setIsAuthenticated} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tasks/edit/:id"
          element={
            isAuthenticated ? <TaskForm setAuth={setIsAuthenticated} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;