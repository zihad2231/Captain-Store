import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    if (updatedOrder) {
      setOrders(orders.map(o => (o.id === orderId ? updatedOrder : o)));
    }
  };

  if (loading) return <div>Loading Orders...</div>;

  return (
    <div>
      <h2 className="mb-4">Order Management</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'Pending' ? 'bg-warning text-dark' :
                    order.status === 'Shipped' ? 'bg-primary' :
                    order.status === 'Delivered' ? 'bg-success' : 'bg-secondary'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="form-select form-select-sm" 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
