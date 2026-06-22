import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, LogOut, Shield, Menu, X, Bell, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { NotificationContext } from '../context/NotificationContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setDropdownOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, user]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white', borderBottom: '1px solid var(--border)', paddingTop: '24px', paddingBottom: '16px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Mobile Menu Toggle */}
        <div className="hide-on-desktop">
          <Menu size={24} onClick={() => setMobileMenuOpen(true)} style={{ cursor: 'pointer', display: 'block' }} className="mobile-menu-icon" />
        </div>

        {/* Logo */}
        <Link to="/" style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-inter)' }}>
          Exclusive
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '48px', fontSize: '16px', fontWeight: '500' }}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
        </nav>
        
        {/* Search & Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          <div className="search-bar-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What are you looking for?" 
              style={{ backgroundColor: 'var(--secondary)', padding: '10px 40px 10px 20px', border: 'none', borderRadius: '4px', fontSize: '12px' }}
            />
            <Search size={20} onClick={handleSearch} style={{ position: 'absolute', right: '12px', cursor: 'pointer' }} />
          </div>
          
          <Link to="/wishlist" style={{ position: 'relative' }}>
            <Heart size={24} style={{ cursor: 'pointer' }} />
            {wishlistItems.length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>{wishlistItems.length}</span>
            )}
          </Link>
          <Link to="/cart" style={{ position: 'relative' }}>
            <ShoppingCart size={24} style={{ cursor: 'pointer', color: 'var(--black)' }} />
            {cartItems.length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>{cartItems.length}</span>
            )}
          </Link>

          {user && (
            <div ref={notifRef} style={{ position: 'relative' }}>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}>
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>{unreadCount}</span>
                )}
              </div>
              {notifOpen && (
                <div style={{ position: 'absolute', right: '-50px', top: '40px', backgroundColor: 'white', color: 'var(--black)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '8px', width: '320px', zIndex: 50, maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          onClick={() => {
                            if (!n.read) markAsRead(n._id);
                            if (n.orderId) {
                              if (user.role === 'admin') {
                                navigate('/admin/orders');
                              } else if (n.type && n.type.includes('RETURN')) {
                                navigate('/returns');
                              } else if (n.type && n.type.includes('CANCEL')) {
                                navigate('/cancellations');
                              } else {
                                navigate('/orders');
                              }
                              setNotifOpen(false);
                            }
                          }}
                          style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: n.read ? 'white' : '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'background-color 0.2s' }}
                        >
                          <span style={{ fontSize: '13px', color: 'var(--black)', fontWeight: n.read ? '400' : '500' }}>{n.message}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div 
                style={{ backgroundColor: 'var(--primary)', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
              >
                <User size={20} color="white" />
              </div>
              
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '30px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', backdropFilter: 'blur(10px)', borderRadius: '4px', width: '220px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
                  <Link to="/account" style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'white', outline: 'none' }} onClick={() => setDropdownOpen(false)}><User size={20} /> Manage My Account</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'white', outline: 'none' }} onClick={() => setDropdownOpen(false)}><Shield size={20} /> Admin Panel</Link>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', outline: 'none' }} onClick={handleLogout}><LogOut size={20} /> Logout</div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white', backgroundColor: 'var(--primary)', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
              <User size={18} />
              Login / Register
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', zIndex: 1000, padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <Link to="/" style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-inter)' }} onClick={() => setMobileMenuOpen(false)}>Exclusive</Link>
            <X size={24} onClick={() => setMobileMenuOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') { handleSearch(); setMobileMenuOpen(false); } }}
              placeholder="What are you looking for?" 
              style={{ backgroundColor: 'var(--secondary)', padding: '12px 40px 12px 20px', border: 'none', borderRadius: '4px', fontSize: '14px', width: '100%' }}
            />
            <Search size={20} onClick={() => { handleSearch(); setMobileMenuOpen(false); }} style={{ position: 'absolute', right: '12px', cursor: 'pointer' }} />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '18px', fontWeight: '500' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
