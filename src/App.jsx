import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
// import SignUp from './pages/SignUp'; // Removed separate signup
import Account from './pages/Account';
import ChangePassword from './pages/ChangePassword';
import Returns from './pages/Returns';
import Cancellations from './pages/Cancellations';
import Orders from './pages/Orders';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminCoupons from './pages/AdminCoupons';
import AdminUsers from './pages/AdminUsers';
import ScrollToTop from './components/ScrollToTop';
import SignUp from './pages/SignUp';
import Contact from './pages/Contact';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Login />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/resetpassword/:token" element={<ResetPassword />} />
            
                  {/* Protected Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/coupons" element={<AdminCoupons />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/cancellations" element={<Cancellations />} />
                  <Route path="products" element={<Products />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
