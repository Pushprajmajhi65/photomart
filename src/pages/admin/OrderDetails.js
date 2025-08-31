import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOrder = {
        id: orderId,
        customer: { 
          name: 'John Doe', 
          email: 'john@example.com', 
          phone: '+91 98765 43210',
          address: '123 Main St, Apartment 4B, Mumbai, Maharashtra 400001'
        },
        items: [
          { 
            id: 1,
            name: 'Mountain Mist', 
            description: 'Serene mountain landscape with morning fog',
            size: '18"×24"', 
            price: 800, 
            quantity: 1,
            image: 'nature-1',
            customizations: 'Premium matte finish'
          },
          { 
            id: 2,
            name: 'Color Flow', 
            description: 'Dynamic abstract with flowing colors',
            size: '12"×18"', 
            price: 400, 
            quantity: 2,
            image: 'abstract-1',
            customizations: 'Glossy finish'
          }
        ],
        subtotal: 1600,
        shipping: 0,
        tax: 0,
        total: 1600,
        status: 'processing',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryDate: '2024-01-20T10:30:00Z',
        shippingAddress: '123 Main St, Apartment 4B, Mumbai, Maharashtra 400001',
        billingAddress: '123 Main St, Apartment 4B, Mumbai, Maharashtra 400001',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        trackingNumber: 'TRK001234567',
        orderNotes: 'Please handle with care. Gift wrapping requested.',
        statusHistory: [
          { status: 'pending', date: '2024-01-15T10:30:00Z', note: 'Order placed' },
          { status: 'processing', date: '2024-01-15T14:20:00Z', note: 'Payment confirmed, preparing order' },
        ]
      };

      setOrder(mockOrder);
      setTrackingNumber(mockOrder.trackingNumber || '');
      setLoading(false);
    } catch (error) {
      console.error('Error loading order details:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      // Replace with actual API call
      const updatedOrder = {
        ...order,
        status: newStatus,
        statusHistory: [
          ...order.statusHistory,
          { 
            status: newStatus, 
            date: new Date().toISOString(), 
            note: `Status updated to ${newStatus}` 
          }
        ]
      };
      
      setOrder(updatedOrder);
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateTrackingNumber = async () => {
    try {
      // Replace with actual API call
      const updatedOrder = { ...order, trackingNumber };
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating tracking number:', error);
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-details">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/admin/orders')}>
            ← Back to Orders
          </button>
          <div>
            <h1>Order #{order.id}</h1>
            <p>Placed on {formatDate(order.orderDate)}</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="action-btn secondary">Print Invoice</button>
          <button className="action-btn secondary">Send Email</button>
          <button 
            className="action-btn primary"
            onClick={() => setShowStatusModal(true)}
          >
            Update Status
          </button>
        </div>
      </div>

      <div className="order-details-grid">
        {/* Order Status */}
        <motion.div 
          className="details-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>Order Status</h2>
          <div className="status-info">
            <span 
              className="status-badge"
              style={{ 
                backgroundColor: getStatusColor(order.status) + '20',
                color: getStatusColor(order.status),
                border: `1px solid ${getStatusColor(order.status)}40`
              }}
            >
              {order.status.toUpperCase()}
            </span>
            <div className="payment-info">
              <span className={`payment-status ${order.paymentStatus}`}>
                Payment: {order.paymentStatus}
              </span>
              <span className="payment-method">via {order.paymentMethod}</span>
            </div>
          </div>

          {/* Status History */}
          <div className="status-history">
            <h3>Status History</h3>
            {order.statusHistory.map((entry, index) => (
              <div key={index} className="history-item">
                <div className="history-dot" style={{ backgroundColor: getStatusColor(entry.status) }}></div>
                <div className="history-content">
                  <span className="history-status">{entry.status.toUpperCase()}</span>
                  <span className="history-date">{formatDate(entry.date)}</span>
                  {entry.note && <p className="history-note">{entry.note}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Tracking */}
          <div className="tracking-section">
            <h3>Tracking Information</h3>
            <div className="tracking-input">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
              <button onClick={updateTrackingNumber}>Update</button>
            </div>
          </div>
        </motion.div>

        {/* Customer Information */}
        <motion.div 
          className="details-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Customer Information</h2>
          <div className="customer-details">
            <div className="customer-field">
              <label>Name:</label>
              <span>{order.customer.name}</span>
            </div>
            <div className="customer-field">
              <label>Email:</label>
              <span>{order.customer.email}</span>
            </div>
            <div className="customer-field">
              <label>Phone:</label>
              <span>{order.customer.phone}</span>
            </div>
          </div>

          <div className="address-section">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress}</p>
          </div>

          <div className="address-section">
            <h3>Billing Address</h3>
            <p>{order.billingAddress}</p>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div 
          className="details-card order-items-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={item.id} className="item-row">
                <div className={`item-image ${item.image}`}></div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <div className="item-specs">
                    <span>Size: {item.size}</span>
                    <span>Quantity: {item.quantity}</span>
                    {item.customizations && <span>Custom: {item.customizations}</span>}
                  </div>
                </div>
                <div className="item-price">
                  <span className="unit-price">₹{item.price} each</span>
                  <span className="total-price">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Notes */}
        {order.orderNotes && (
          <motion.div 
            className="details-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Order Notes</h2>
            <p>{order.orderNotes}</p>
          </motion.div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Order Status</h3>
              <button className="close-btn" onClick={() => setShowStatusModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Current status: <strong>{order.status}</strong></p>
              <div className="status-options">
                {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    className={`status-option ${status === order.status ? 'current' : ''}`}
                    onClick={() => updateOrderStatus(status)}
                    style={{ 
                      backgroundColor: getStatusColor(status) + '20',
                      color: getStatusColor(status),
                      border: `1px solid ${getStatusColor(status)}40`
                    }}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
