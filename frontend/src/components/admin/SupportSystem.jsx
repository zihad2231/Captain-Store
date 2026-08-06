import React, { useEffect, useState } from 'react';
import { getTickets, replyTicket } from '../../services/api';

const SupportSystem = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    const updated = await replyTicket(activeTicket.id, { 
      adminReply: replyText, 
      status: 'Resolved' 
    });

    if (updated) {
      setTickets(tickets.map(t => (t.id === updated.id ? updated : t)));
      setActiveTicket(null);
      setReplyText('');
    }
  };

  if (loading) return <div>Loading Tickets...</div>;

  return (
    <div>
      <h2 className="mb-4">Support System</h2>
      
      <div className="row">
        <div className="col-md-7">
          <div className="list-group">
            {tickets.map(ticket => (
              <button 
                key={ticket.id} 
                onClick={() => { setActiveTicket(ticket); setReplyText(ticket.adminReply || ''); }}
                className={`list-group-item list-group-item-action ${activeTicket?.id === ticket.id ? 'active' : ''}`}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{ticket.subject}</h5>
                  <small>{new Date(ticket.createdAt).toLocaleDateString()}</small>
                </div>
                <p className="mb-1 text-truncate">{ticket.message}</p>
                <small>By: {ticket.customerName} &bull; <span className={`badge ${ticket.status === 'Open' ? 'bg-danger' : 'bg-success'}`}>{ticket.status}</span></small>
              </button>
            ))}
            {tickets.length === 0 && (
              <div className="list-group-item">No support tickets found.</div>
            )}
          </div>
        </div>
        
        <div className="col-md-5">
          {activeTicket ? (
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                Ticket #{activeTicket.id}: {activeTicket.subject}
              </div>
              <div className="card-body">
                <p><strong>Customer:</strong> {activeTicket.customerName}</p>
                <div className="p-3 mb-3 bg-light rounded">
                  {activeTicket.message}
                </div>
                
                <form onSubmit={handleReply}>
                  <div className="mb-3">
                    <label className="form-label">Admin Reply</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here to resolve..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Send Reply & Resolve</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card card-body text-center text-muted">
              Select a ticket to view and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportSystem;
