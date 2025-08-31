import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalOrders: 156,
        totalRevenue: 245800,
        totalProducts: 89,
        totalCustomers: 234
      });

      setRecentOrders([
        { id: 'ORD001', customer: 'John Doe', amount: 1200, status: 'completed', date: '2024-01-15' },
        { id: 'ORD002', customer: 'Jane Smith', amount: 800, status: 'processing', date: '2024-01-15' },
        { id: 'ORD003', customer: 'Mike Johnson', amount: 1500, status: 'shipped', date: '2024-01-14' },
        { id: 'ORD004', customer: 'Sarah Wilson', amount: 600, status: 'pending', date: '2024-01-14' },
        { id: 'ORD005', customer: 'David Brown', amount: 2200, status: 'completed', date: '2024-01-13' }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#10b981',
      processing: '#f59e0b',
      shipped: '#3b82f6',
      pending: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon orders">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon revenue">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-change positive">+18% from last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon products">🖼️</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Products</p>
            <span className="stat-change positive">+5 new this month</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon customers">👥</div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Customers</p>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div 
        className="dashboard-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="view-all-btn">View All Orders</button>
        </div>
        
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          
          {recentOrders.map((order, index) => (
            <motion.div 
              key={order.id}
              className="table-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <span className="order-id">{order.id}</span>
              <span className="customer-name">{order.customer}</span>
              <span className="order-amount">₹{order.amount}</span>
              <span 
                className="order-status"
                style={{ 
                  color: getStatusColor(order.status),
                  backgroundColor: getStatusColor(order.status) + '20',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                {order.status}
              </span>
              <span className="order-date">{order.date}</span>
              <div className="order-actions">
                <button className="action-btn view">👁️</button>
                <button className="action-btn edit">✏️</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>


    </div>
  );
}
