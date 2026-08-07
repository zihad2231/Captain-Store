import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Analytics from '../components/admin/Analytics';
import CustomerProfiles from '../components/admin/CustomerProfiles';
import OrderManagement from '../components/admin/OrderManagement';
import InventoryControl from '../components/admin/InventoryControl';
import SupportSystem from '../components/admin/SupportSystem';
import SettingsPanel from '../components/admin/SettingsPanel';

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
      case 'settings': return <SettingsPanel />;
      default: return <Analytics />;
    }
  };

  return (
    <div className="container-fluid py-5 bg-light" style={{ minHeight: '85vh' }}>
      <div className="row g-4 mb-4 align-items-center mx-1">
        <div className="col-12 glass-panel p-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
              Welcome back, {user.name === 'Omar' ? 'Omar 👋' : user.name + ' 👋'}
            </h2>
            <p className="text-muted mb-0">Captain Store Central Control Panel &bull; System Status: <span className="text-success fw-bold">Online</span></p>
          </div>
          <div className="d-none d-md-block text-end">
            <div className="small text-muted mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <span className="badge bg-dark rounded-pill px-3 py-2">Super Admin</span>
          </div>
        </div>
      </div>

      <div className="row mx-1">
        {/* Sidebar */}
        <div className="col-lg-3 col-xl-2 mb-4 mb-lg-0">
          <div className="glass-panel p-3 h-100 border-0">
            <h5 className="text-muted text-uppercase small fw-bold mb-4 ps-2 mt-2">Menu</h5>
            <div className="nav flex-column nav-pills gap-2">
              <button 
                className={`btn text-start border-0 rounded-3 py-3 px-3 d-flex align-items-center gap-3 ${activeTab === 'analytics' ? 'btn-primary shadow-sm text-white' : 'btn-light text-dark hover-primary'}`}
                onClick={() => setActiveTab('analytics')}
                style={{ transition: 'all 0.3s' }}
              >
                <i className="fs-5">📊</i> <span className="fw-medium">Analytics</span>
              </button>
              <button 
                className={`btn text-start border-0 rounded-3 py-3 px-3 d-flex align-items-center gap-3 ${activeTab === 'customers' ? 'btn-primary shadow-sm text-white' : 'btn-light text-dark hover-primary'}`}
                onClick={() => setActiveTab('customers')}
                style={{ transition: 'all 0.3s' }}
              >
                <i className="fs-5">👥</i> <span className="fw-medium">Customers</span>
              </button>
              <button 
                className={`btn text-start border-0 rounded-3 py-3 px-3 d-flex align-items-center gap-3 ${activeTab === 'orders' ? 'btn-primary shadow-sm text-white' : 'btn-light text-dark hover-primary'}`}
                onClick={() => setActiveTab('orders')}
                style={{ transition: 'all 0.3s' }}
              >
                <i className="fs-5">📦</i> <span className="fw-medium">Orders</span>
              </button>
              <button 
                className={`btn text-start border-0 rounded-3 py-3 px-3 d-flex align-items-center gap-3 ${activeTab === 'inventory' ? 'btn-primary shadow-sm text-white' : 'btn-light text-dark hover-primary'}`}
                onClick={() => setActiveTab('inventory')}
                style={{ transition: 'all 0.3s' }}
              >
                <i className="fs-5">📝</i> <span className="fw-medium">Inventory</span>
              </button>
              <button 
                className={`btn text-start border-0 rounded-3 py-3 px-3 d-flex align-items-center gap-3 ${activeTab === 'support' ? 'btn-primary shadow-sm text-white' : 'btn-light text-dark hover-primary'}`}
                onClick={() => setActiveTab('support')}
                style={{ transition: 'all 0.3s' }}
              >
                <i className="fs-5">🎧</i> <span className="fw-medium">Support</span>
              </button>
              <button 
                className={`btn text-start border-0 rounded-3 py-3 px-3 d-flex align-items-center gap-3 ${activeTab === 'settings' ? 'btn-primary shadow-sm text-white' : 'btn-light text-dark hover-primary'}`}
                onClick={() => setActiveTab('settings')}
                style={{ transition: 'all 0.3s' }}
              >
                <i className="fs-5">⚙️</i> <span className="fw-medium">Settings</span>
              </button>
            </div>
            
            <div className="mt-5 border-top pt-4 ps-2">
              <h5 className="text-muted text-uppercase small fw-bold mb-3">Quick Actions</h5>
              <button className="btn btn-sm btn-outline-dark w-100 mb-2 rounded-pill text-start"><i className="bi bi-plus"></i> New Product</button>
              <button className="btn btn-sm btn-outline-dark w-100 rounded-pill text-start"><i className="bi bi-gear"></i> Store Settings</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-xl-10">
          <div className="glass-panel p-4 h-100 border-0" style={{ minHeight: '600px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
              <h4 className="fw-bold m-0 text-capitalize">{activeTab} Dashboard</h4>
              <button className="btn btn-light border-0 shadow-sm rounded-circle" style={{width: '40px', height: '40px'}}>
                <i className="bi bi-arrow-clockwise"></i> 🔄
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
