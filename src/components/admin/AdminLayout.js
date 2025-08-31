import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AdminLayout.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'products', label: 'Products', icon: '🖼️', path: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: '📦', path: '/admin/orders' },
    { id: 'customers', label: 'Customers', icon: '👥', path: '/admin/customers' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <motion.aside 
        className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="logo-icon">📸</span>
            {sidebarOpen && <span className="logo-text">PhotoMart Admin</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </motion.button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button 
            className="logout-btn"
            onClick={() => navigate('/')}
          >
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-label">Back to Site</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-header-right">
            <div className="admin-user">
              <span className="user-avatar">👤</span>
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
