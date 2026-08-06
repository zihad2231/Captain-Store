import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const data = await getMyOrders(user.id);
        setOrders(data || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please log in to view your orders.</h2>
        <Link to="/login" className="btn btn-primary mt-3">Log In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="alert alert-info">You have no previous orders.</div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-12" key={order.id}>
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                  <span className="fw-bold text-muted">Order #{order.id}</span>
                  <span className="badge bg-secondary">{order.status}</span>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Placed on:</p>
                      <p className="fw-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <p className="mb-1 text-muted">Total:</p>
                      <p className="fw-bold fs-5 text-primary">৳ {order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <h6 className="fw-bold mb-3">Items:</h6>
                  <ul className="list-group list-group-flush mb-0">
                    {order.orderItems.map((item, index) => (
                      <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center" key={index}>
                        <div>
                          <span>{item.name}</span>
                          <span className="text-muted ms-2">x {item.quantity}</span>
                        </div>
                        <span className="text-muted">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
