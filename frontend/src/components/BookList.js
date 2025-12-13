import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await booksAPI.delete(id);
        fetchBooks();
      } catch (err) {
        alert('Error al eliminar el libro');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Cargando libros...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="card-title">Libros</h2>
        <Link to="/books/new" className="btn btn-primary">
          + Nuevo Libro
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Año</th>
              <th>Categoría</th>
              <th>Disponibles</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.publicationYear}</td>
                <td>{book.categoryName}</td>
                <td>
                  <span className={`status-badge ${book.availableCopies > 0 ? 'status-active' : 'status-overdue'}`}>
                    {book.availableCopies}
                  </span>
                </td>
                <td>{book.totalCopies}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/books/edit/${book.id}`} className="btn btn-sm btn-warning">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookList;