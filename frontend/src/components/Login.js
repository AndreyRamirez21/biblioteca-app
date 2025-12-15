import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../components/Login.css';
import logo from '../assets/logo.png';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(credentials);

      if (response?.data?.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        if (onLogin) onLogin(response.data.user);
        navigate('/');
      } else {
        setError(response?.data?.message || 'Credenciales inválidas');
      }
    } catch (err) {
      if (err?.response?.data) {
        setError(err.response.data.message || 'Error al iniciar sesión');
      } else {
        setError('Error de conexión. Verifica que el servidor esté funcionando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" role="main" aria-labelledby="login-title">
        <div className="login-header">
          <img src={logo} alt="Logo Biblioteca" className="login-logo" />
          <h1 id="login-title">Biblioteca Digital</h1>
          <p>Acceso Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && <div className="error-message" role="alert">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="admin@library.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="form-control"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>💡 Credenciales por defecto:</p>
          <p><strong>Email:</strong> admin@library.com</p>
          <p><strong>Contraseña:</strong> password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
