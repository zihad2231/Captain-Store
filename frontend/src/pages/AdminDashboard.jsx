import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Analytics from '../components/admin/Analytics';
import CustomerProfiles from '../components/admin/CustomerProfiles';
import OrderManagement from '../components/admin/OrderManagement';
import InventoryControl from '../components/admin/InventoryControl';
import SupportSystem from '../components/admin/SupportSystem';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('analytics');

  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics': return <Analytics />;
      case 'customers': return <CustomerProfiles />;
      case 'orders': return <OrderManagement />;
      case 'inventory': return <InventoryControl />;
      case 'support': return <SupportSystem />;
      default: return <Analytics />;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-white sidebar shadow-sm rounded p-3 mb-4 mb-md-0">
          <h4 className="text-center mb-4 text-primary fw-bold">Admin Panel</h4>
          <div className="nav flex-column nav-pills">
            <button 
              className={`nav-link text-start mb-2 ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📊 Analytics
            </button>
            <button 
              className={`nav-link text-start mb-2 ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              👥 Customers
            </button>
            <button 
              className={`nav-link text-start mb-2 ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Orders
            </button>
            <button 
              className={`nav-link text-start mb-2 ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              📝 Inventory
            </button>
            <button 
              className={`nav-link text-start mb-2 ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              🎧 Support
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
