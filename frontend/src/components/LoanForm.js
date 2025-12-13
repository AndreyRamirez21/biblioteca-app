import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loansAPI, usersAPI, booksAPI } from '../services/api';

function LoanForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
    calculateDueDate();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, booksRes] = await Promise.all([
        usersAPI.getAll(),
        booksAPI.getAll()
      ]);
      setUsers(usersRes.data);
      setBooks(booksRes.data.filter(book => book.availableCopies > 0));
    } catch (err) {
      console.error(err);
    }
  };

  const calculateDueDate = () => {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14); // 14 días después
    setFormData(prev => ({
      ...prev,
      dueDate: dueDate.toISOString().split('T')[0]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loansAPI.create(formData);
      navigate('/loans');
    } catch (err) {
      alert('Error al crear el préstamo. Verifica que el libro tenga copias disponibles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Nuevo Préstamo</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Usuario</label>
          <select
            name="userId"
            className="form-control"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} - {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Libro</label>
          <select
            name="bookId"
            className="form-control"
            value={formData.bookId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un libro</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} - {book.author} (Disponibles: {book.availableCopies})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Fecha de Préstamo</label>
            <input
              type="date"
              name="loanDate"
              className="form-control"
              value={formData.loanDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Vencimiento</label>
            <input
              type="date"
              name="dueDate"
              className="form-control"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notas</label>
          <textarea
            name="notes"
            className="form-control"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Notas adicionales (opcional)"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Préstamo'}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate('/loans')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoanForm;