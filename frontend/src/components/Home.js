import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationCard from './NotificationCard';

function Home() {
  const navigate = useNavigate();

  const modules = [
    {
      icon: '👥',
      title: 'Usuarios',
      description: 'Gestión de usuarios del sistema',
      path: '/users'
    },
    {
      icon: '📚',
      title: 'Libros',
      description: 'Catálogo de libros disponibles',
      path: '/books'
    },
    {
      icon: '📑',
      title: 'Categorías',
      description: 'Organización por categorías',
      path: '/categories'
    },
    {
      icon: '📋',
      title: 'Préstamos',
      description: 'Control de préstamos activos',
      path: '/loans'
    }
  ];

  return (
    <div className="card">
      <h1 className="card-title">Sistema de Gestión de Biblioteca Digital</h1>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>
        Bienvenido al sistema de gestión de biblioteca. Selecciona un módulo para comenzar.
      </p>

      <div className="home-grid">
        {modules.map((module, index) => (
          <div
            key={index}
            className="home-card"
            onClick={() => navigate(module.path)}
          >
            <div className="home-card-icon">{module.icon}</div>
            <h3 className="home-card-title">{module.title}</h3>
            <p className="home-card-description">{module.description}</p>
          </div>
        ))}

        <NotificationCard />  {/* ← IMPORTANTE */}
      </div>
    </div>
  );
}

export default Home;