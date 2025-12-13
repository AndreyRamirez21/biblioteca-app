import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loansAPI, usersAPI, booksAPI } from '../services/api';

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState({});
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loansRes, usersRes, booksRes] = await Promise.all([
        loansAPI.getAll(),
        usersAPI.getAll(),
        booksAPI.getAll()
      ]);

      setLoans(loansRes.data);

      const usersMap = {};
      usersRes.data.forEach(user => {
        usersMap[user.id] = `${user.firstName} ${user.lastName}`;
      });
      setUsers(usersMap);

      const booksMap = {};
      booksRes.data.forEach(book => {
        booksMap[book.id] = book.title;
      });
      setBooks(booksMap);

      setError(null);
    } catch (err) {
      setError('Error al cargar los préstamos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('¿Confirmar devolución del libro?')) {
      try {
        await loansAPI.returnLoan(id);
        fetchData();
      } catch (err) {
        alert('Error al procesar la devolución');
        console.error(err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'ACTIVE': return 'status-active';
      case 'RETURNED': return 'status-returned';
      case 'OVERDUE': return 'status-overdue';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) return <div className="loading">Cargando préstamos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="card-title">Préstamos</h2>
        <Link to="/loans/new" className="btn btn-primary">
          + Nuevo Préstamo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Libro</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Vencimiento</th>
              <th>Fecha Devolución</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{users[loan.userId] || 'N/A'}</td>
                <td>{books[loan.bookId] || 'N/A'}</td>
                <td>{formatDate(loan.loanDate)}</td>
                <td>{formatDate(loan.dueDate)}</td>
                <td>{loan.returnDate ? formatDate(loan.returnDate) : '-'}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(loan.status)}`}>
                    {loan.status === 'ACTIVE' ? 'Activo' :
                     loan.status === 'RETURNED' ? 'Devuelto' : 'Vencido'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {loan.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        className="btn btn-sm btn-success"
                      >
                        Devolver
                      </button>
                    )}
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

export default LoanList;