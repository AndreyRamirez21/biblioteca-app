import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import LoanList from './components/LoanList';
import LoanForm from './components/LoanForm';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import Home from './components/Home';
import Login from './components/Login';
import './App.css';
import logo from './assets/logo.png';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');

    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo" aria-label="Inicio">
                <img src={logo} alt="Biblioteca" className="nav-logo-img" />
                <span className="nav-logo-text">Biblioteca Digital</span>
              </Link>

              <ul className="nav-menu">
                <li><Link to="/" className="nav-link">Inicio</Link></li>
                <li><Link to="/users" className="nav-link">Usuarios</Link></li>
                <li><Link to="/books" className="nav-link">Libros</Link></li>
                <li><Link to="/categories" className="nav-link">Categorías</Link></li>
                <li><Link to="/loans" className="nav-link">Préstamos</Link></li>
                <li>
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    Cerrar Sesión {user?.firstName ? `(${user.firstName})` : ''}
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        )}

        <div className={isAuthenticated ? "main-content" : ""}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            }/>

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
            <Route path="/users/new" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="/users/edit/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
            <Route path="/books/new" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
            <Route path="/books/edit/:id" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
            <Route path="/categories/new" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
            <Route path="/categories/edit/:id" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute><LoanList /></ProtectedRoute>} />
            <Route path="/loans/new" element={<ProtectedRoute><LoanForm /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
