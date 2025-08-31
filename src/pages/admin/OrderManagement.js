import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          id: 'ORD001',
          customer: { name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210' },
          items: [
            { name: 'Mountain Mist', size: '18"×24"', price: 800, quantity: 1 },
            { name: 'Color Flow', size: '12"×18"', price: 400, quantity: 2 }
          ],
          total: 1600,
          status: 'completed',
          orderDate: '2024-01-15T10:30:00Z',
          deliveryDate: '2024-01-20T10:30:00Z',
          shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
          paymentStatus: 'paid',
          trackingNumber: 'TRK001234567'
        },
        {
          id: 'ORD002',
          customer: { name: 'Jane Smith', email: 'jane@example.com', phone: '+91 98765 43211' },
          items: [
            { name: 'Ocean Waves', size: '24"×36"', price: 1300, quantity: 1 }
          ],
          total: 1300,
          status: 'processing',
          orderDate: '2024-01-14T14:20:00Z',
          deliveryDate: null,
          shippingAddress: '456 Park Ave, Delhi, Delhi 110001',
          paymentStatus: 'paid',
          trackingNumber: null
        },
        {
          id: 'ORD003',
          customer: { name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 98765 43212' },
          items: [
            { name: 'Simple Lines', size: '20"×30"', price: 1050, quantity: 1 },
            { name: 'Zen Balance', size: '18"×24"', price: 800, quantity: 1 }
          ],
          total: 1850,
          status: 'shipped',
          orderDate: '2024-01-13T09:15:00Z',
          deliveryDate: '2024-01-18T09:15:00Z',
          shippingAddress: '789 Oak St, Bangalore, Karnataka 560001',
          paymentStatus: 'paid',
          trackingNumber: 'TRK001234568'
        },
        {
          id: 'ORD004',
          customer: { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91 98765 43213' },
          items: [
            { name: 'Cristiano Ronaldo', size: '18"×24"', price: 800, quantity: 1 }
          ],
          total: 800,
          status: 'pending',
          orderDate: '2024-01-12T16:45:00Z',
          deliveryDate: null,
          shippingAddress: '321 Elm St, Chennai, Tamil Nadu 600001',
          paymentStatus: 'pending',
          trackingNumber: null
        }
      ];

      setOrders(mockOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Replace with actual API call
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      const diffTime = Math.abs(today - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return diffDays <= 1;
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Order Management</h1>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat">
            <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-number">{orders.filter(o => o.status === 'processing').length}</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              className="table-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="order-id-cell">
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{formatDate(order.orderDate).split(',')[0]}</span>
              </div>

              <div className="customer-cell">
                <span className="customer-name">{order.customer.name}</span>
                <span className="customer-email">{order.customer.email}</span>
              </div>

              <div className="items-cell">
                <span className="items-count">{order.items.length} item(s)</span>
                <span className="items-quantity">{order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span>
              </div>

              <div className="total-cell">
                <span className="total-amount">₹{order.total}</span>
                <span className={`payment-status ${order.paymentStatus}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>

              <div className="status-cell">
                <span 
                  className={`status-badge ${order.status}`}
                  style={{ 
                    backgroundColor: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}40`
                  }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="actions-cell">
                <button 
                  className="action-btn view-details"
                  onClick={() => openDetailsModal(order)}
                  title="View Details"
                >
                  View Details
                </button>
                <button 
                  className="action-btn print"
                  title="Print Invoice"
                >
                  🖨️
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-orders">
          <h3>No orders found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              className="modal-content order-details-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Order Details - #{selectedOrder.id}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="order-details-content">
                {/* Order Summary */}
                <div className="order-summary-section">
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Order ID</span>
                      <span className="summary-value">#{selectedOrder.id}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Order Date</span>
                      <span className="summary-value">{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Amount</span>
                      <span className="summary-value">₹{selectedOrder.total}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Payment Status</span>
                      <span className={`summary-value payment-${selectedOrder.paymentStatus}`}>
                        {selectedOrder.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-details-grid">
                  {/* Customer Information */}
                  <div className="customer-info-section">
                    <h4>Customer Information</h4>
                    <div className="customer-details">
                      <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{selectedOrder.customer.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedOrder.customer.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{selectedOrder.shippingAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Status & Tracking */}
                  <div className="status-info-section">
                    <h4>Order Status & Tracking</h4>
                    <div className="status-details">
                      <div className="detail-row">
                        <span className="detail-label">Current Status:</span>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                          className="status-select-modal"
                          style={{ 
                            backgroundColor: getStatusColor(selectedOrder.status) + '20',
                            color: getStatusColor(selectedOrder.status),
                            border: `1px solid ${getStatusColor(selectedOrder.status)}40`
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="detail-row">
                          <span className="detail-label">Tracking Number:</span>
                          <span className="detail-value tracking-number">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Order Age:</span>
                        <span className="detail-value">
                          {Math.ceil((new Date() - new Date(selectedOrder.orderDate)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      {selectedOrder.deliveryDate && (
                        <div className="detail-row">
                          <span className="detail-label">Expected Delivery:</span>
                          <span className="detail-value">{formatDate(selectedOrder.deliveryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="items-section">
                  <h4>Order Items</h4>
                  <div className="items-table">
                    <div className="items-header">
                      <span>Product</span>
                      <span>Size</span>
                      <span>Quantity</span>
                      <span>Unit Price</span>
                      <span>Total</span>
                    </div>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-row-modal">
                        <span className="item-name">{item.name}</span>
                        <span className="item-size">{item.size}</span>
                        <span className="item-quantity">{item.quantity}</span>
                        <span className="item-unit-price">₹{item.price}</span>
                        <span className="item-total-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="items-total">
                      <div className="total-row">
                        <span className="total-label">Subtotal:</span>
                        <span className="total-value">₹{selectedOrder.total}</span>
                      </div>
                      <div className="total-row">
                        <span className="total-label">Shipping:</span>
                        <span className="total-value">Free</span>
                      </div>
                      <div className="total-row grand-total">
                        <span className="total-label">Grand Total:</span>
                        <span className="total-value">₹{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="payment-section">
                  <h4>Payment Information</h4>
                  <div className="payment-details">
                    <div className="payment-grid">
                      <div className="payment-item">
                        <span className="payment-label">Payment Status</span>
                        <span className={`payment-value status-${selectedOrder.paymentStatus}`}>
                          {selectedOrder.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending Payment'}
                        </span>
                      </div>
                      <div className="payment-item">
                        <span className="payment-label">Payment Method</span>
                        <span className="payment-value">{selectedOrder.paymentMethod || 'Credit Card'}</span>
                      </div>
                      <div className="payment-item">
                        <span className="payment-label">Transaction ID</span>
                        <span className="payment-value">{selectedOrder.transactionId || 'TXN' + selectedOrder.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="update-status-btn"
                  onClick={() => {
                    // Handle status update
                    console.log('Update status for order:', selectedOrder.id);
                  }}
                >
                  Update Status
                </button>
                <button 
                  className="print-invoice-btn"
                  onClick={() => {
                    // Handle print invoice
                    console.log('Print invoice for order:', selectedOrder.id);
                  }}
                >
                  🖨️ Print Invoice
                </button>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
