import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Analytics...</div>;
  if (!data) return <div>Error loading data.</div>;

  return (
    <div>
      <h2 className="mb-4">Analytics Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total Sales</div>
            <div className="card-body">
              <h4 className="card-title">${data.totalSales.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total Users</div>
            <div className="card-body">
              <h4 className="card-title">{data.totalUsers}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Pending Orders</div>
            <div className="card-body">
              <h4 className="card-title">{data.pendingOrders}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Total Products</div>
            <div className="card-body">
              <h4 className="card-title">{data.totalProducts}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Low Stock Items</div>
            <div className="card-body">
              <h4 className="card-title">{data.lowStockItems}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
