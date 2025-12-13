import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import LoanList from './components/LoanList';
import LoanForm from './components/LoanForm';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              📚 Biblioteca Digital
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className="nav-link">Usuarios</Link>
              </li>
              <li className="nav-item">
                <Link to="/books" className="nav-link">Libros</Link>
              </li>
              <li className="nav-item">
                <Link to="/categories" className="nav-link">Categorías</Link>
              </li>
              <li className="nav-item">
                <Link to="/loans" className="nav-link">Préstamos</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/edit/:id" element={<BookForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />
            <Route path="/loans" element={<LoanList />} />
            <Route path="/loans/new" element={<LoanForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;