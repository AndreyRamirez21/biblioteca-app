import React, { useState, useEffect } from 'react';

const NotificationCard = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchActiveLoans();
  }, []);

const fetchActiveLoans = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/loans/active');
    const data = await response.json();
    setActiveLoans(data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching loans:', error);
    setLoading(false);
  }
};
  const sendAllNotifications = async () => {
    setSending(true);
    setMessage('Enviando notificaciones...');

    try {
      let sent = 0;
      for (const loan of activeLoans) {
        const notificationData = {
          userId: loan.userId,
          userEmail: `user${loan.userId}@example.com`,
          type: 'LOAN_REMINDER',
          subject: `Recordatorio: Préstamo activo #${loan.id}`,
          message: `Tienes un préstamo activo. Libro ID: ${loan.bookId}`,
          loanId: loan.id,
          bookId: loan.bookId
        };

            const response = await fetch('http://localhost:8080/api/notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(notificationData)
            });

        const notification = await response.json();
        await fetch(`http://localhost:8080/api/notifications/${notification.id}/send`, {
          method: 'POST'
        });
        sent++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setMessage(`✅ ${sent} notificaciones enviadas`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="home-card">
        <div className="home-card-icon">📧</div>
        <h3 className="home-card-title">Notificaciones</h3>
        <p className="home-card-description">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="home-card">
      <div className="home-card-icon">📧</div>
      <h3 className="home-card-title">Notificaciones</h3>
      <p className="home-card-description">
        Recordatorios de préstamos activos
      </p>

      <div style={{ margin: '15px 0' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
          {activeLoans.length}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          préstamos activos
        </div>
      </div>

      {message && (
        <div style={{
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '10px',
          fontSize: '13px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      <button
        onClick={sendAllNotifications}
        disabled={sending || activeLoans.length === 0}
        style={{
          width: '100%',
          padding: '10px',
          background: activeLoans.length === 0 ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: activeLoans.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        {sending ? 'Enviando...' : `Enviar ${activeLoans.length} notificaciones`}
      </button>
    </div>
  );
};

export default NotificationCard;