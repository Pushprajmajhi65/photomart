import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/layout/Main';
import AdminLayout from './components/admin/AdminLayout';

// Import page components
import Home from './pages/home/Home';
import Collection from './pages/collection/Collection';
import CategoryCollection from './pages/collection/CategoryCollection';
import ProductDetails from './pages/product/ProductDetails';
import ImageEditor from './ImageEditor';

// Import admin pages
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import OrderDetails from './pages/admin/OrderDetails';

// Import admin styles
import './pages/admin/admin.css';
import './App.css';

// Simple pages for remaining routes
const GiftsPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Gift Collection</h1>
      <p>Perfect gifts for your loved ones</p>
    </div>
    <div className="coming-soon">
      <h2>Coming Soon!</h2>
      <p>Our gift collection will be available soon. Stay tuned!</p>
    </div>
  </div>
);

const CheckoutPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Checkout</h1>
      <p>Complete your order</p>
    </div>
    <div className="coming-soon">
      <h2>Checkout Integration</h2>
      <p>Payment gateway integration coming soon!</p>
    </div>
  </div>
);

// Admin placeholder pages
const CustomersPage = () => (
  <div className="page-container">
    <h1>Customer Management</h1>
    <p>Customer management features coming soon!</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="page-container">
    <h1>Analytics</h1>
    <p>Analytics dashboard coming soon!</p>
  </div>
);

const SettingsPage = () => (
  <div className="page-container">
    <h1>Settings</h1>
    <p>Admin settings coming soon!</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route path="/" element={<Main><Home /></Main>} />
        <Route path="/collection" element={<Main><Collection /></Main>} />
        <Route path="/collection/:category" element={<Main><CategoryCollection /></Main>} />
        <Route path="/details/:productId" element={<Main><ProductDetails /></Main>} />
        <Route path="/editor" element={<Main><ImageEditor onBack={() => window.history.back()} /></Main>} />
        <Route path="/gifts" element={<Main><GiftsPage /></Main>} />
        <Route path="/checkout" element={<Main><CheckoutPage /></Main>} />

        {/* Admin Routes with Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Main><Home /></Main>} />
      </Routes>
    </Router>
  );
}

export default App;
