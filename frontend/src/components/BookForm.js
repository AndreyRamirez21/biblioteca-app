import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI, categoriesAPI } from '../services/api';

function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    description: '',
    availableCopies: 0,
    totalCopies: 0,
    categoryId: ''
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getById(id);
      setFormData(response.data);
    } catch (err) {
      alert('Error al cargar el libro');
      console.error(err);
    }
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
      if (id) {
        await booksAPI.update(id, formData);
      } else {
        await booksAPI.create(formData);
      }
      navigate('/books');
    } catch (err) {
      alert('Error al guardar el libro');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">{id ? 'Editar Libro' : 'Nuevo Libro'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Autor</label>
          <input
            type="text"
            name="author"
            className="form-control"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            name="isbn"
            className="form-control"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Año de Publicación</label>
          <input
            type="number"
            name="publicationYear"
            className="form-control"
            value={formData.publicationYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select
            name="categoryId"
            className="form-control"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Copias Disponibles</label>
            <input
              type="number"
              name="availableCopies"
              className="form-control"
              value={formData.availableCopies}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Copias</label>
            <input
              type="number"
              name="totalCopies"
              className="form-control"
              value={formData.totalCopies}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate('/books')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;