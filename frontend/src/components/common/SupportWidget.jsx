import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createTicket, getUserTickets } from '../../services/api';

const SupportWidget = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Only show for non-admin users who are logged in
  if (!user || user.role === 'admin') return null;

  useEffect(() => {
    if (isOpen) {
      fetchMyTickets();
    }
  }, [isOpen]);

  const fetchMyTickets = async () => {
    const userTickets = await getUserTickets(user.id);
    if (userTickets) {
      setTickets(userTickets);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      const ticket = await createTicket({
        userId: user.id,
        userName: user.name,
        subject,
        message
      });
      if (ticket) {
        setStatusMsg('Message sent successfully!');
        setSubject('');
        setMessage('');
        fetchMyTickets();
      } else {
        setStatusMsg('Failed to send message.');
      }
    } catch (err) {
      setStatusMsg('Error sending message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--brand-primary)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: 'pointer'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div 
          className="card shadow-lg border-0"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '350px',
            maxHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div className="card-header bg-primary text-white p-3 fw-bold">
            Customer Support
          </div>
          <div className="card-body" style={{ overflowY: 'auto', flex: 1, backgroundColor: 'var(--brand-bg)' }}>
            
            {tickets.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold text-muted small text-uppercase">Previous Messages</h6>
                {tickets.map(t => (
                  <div key={t._id || t.id} className="mb-3 p-2 border rounded bg-white">
                    <div className="d-flex justify-content-between mb-1">
                      <strong>{t.subject}</strong>
                      <span className={`badge ${t.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>{t.status}</span>
                    </div>
                    <p className="small mb-1">{t.message}</p>
                    {t.reply && (
                      <div className="bg-light p-2 rounded mt-2 border-start border-primary border-3">
                        <small className="fw-bold d-block text-primary">Admin Reply:</small>
                        <small>{t.reply}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-3 rounded border">
              <h6 className="fw-bold mb-3">Send a new message</h6>
              {statusMsg && <div className="alert alert-info py-1 small">{statusMsg}</div>}
              
              <div className="mb-2">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Subject" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea 
                  className="form-control form-control-sm" 
                  placeholder="How can we help you?" 
                  rows="3"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default SupportWidget;
