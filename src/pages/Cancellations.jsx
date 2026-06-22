import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Cancellations = () => {
  const { user } = useContext(AuthContext);
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCancellations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      const filtered = data.filter(order => order.status === 'Cancelled');
      setCancellations(filtered);
    } catch (error) {
      console.error('Failed to fetch cancellations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCancellations();
    }
  }, [user]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0', marginBottom: '40px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>My Cancellations</span>
        </div>
        <div style={{ fontSize: '14px' }}>
          Welcome! <span style={{ color: 'var(--primary)' }}>{user?.name || 'Guest'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '100px', marginBottom: '140px' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Manage My Account</h4>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/account" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Profile</Link>
            <Link to="/change-password" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Change Password</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>My Orders</h4>
            <Link to="/orders" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>Order History</Link>
            <Link to="/returns" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Returns</Link>
            <Link to="/cancellations" style={{ color: 'var(--primary)', marginLeft: '16px', textDecoration: 'none' }}>My Cancellations</Link>
          </div>



        </aside>

        {/* Cancellations Content */}
        <div style={{ flex: 1, padding: '40px 80px', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--primary)', marginBottom: '24px' }}>My Cancellations</h2>
          
          {loading ? (
            <Loader type="skeleton-table" />
          ) : cancellations.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You have no cancellations at this time.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cancellations.map(order => {
                const currentStatus = order.status || 'Cancelled';
                
                let statusColor = '#ef4444'; // Red for Cancelled

                return (
                <div key={order._id} style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', backgroundColor: '#fff' }}>
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fafafa', padding: '20px 24px', borderBottom: '1px solid #eaeaea' }}>
                    <div style={{ display: 'flex', gap: '48px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Order Placed</span>
                        <span style={{ fontWeight: '500', fontSize: '15px', color: 'var(--black)' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Total</span>
                        <span style={{ fontWeight: '500', fontSize: '15px', color: 'var(--black)' }}>${order.totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Order ID</span>
                      <span style={{ fontSize: '14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{order._id}</span>
                    </div>
                  </div>
                  
                  {/* Order Body */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>Status:</span> 
                        <span style={{ 
                          backgroundColor: `${statusColor}22`,
                          color: statusColor,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          letterSpacing: '0.02em'
                        }}>{currentStatus}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {order.orderItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: index < order.orderItems.length - 1 ? '16px' : '0', borderBottom: index < order.orderItems.length - 1 ? '1px solid #eaeaea' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea' }}>
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <span style={{ fontSize: '12px', color: '#999' }}>No Image</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ fontWeight: '500', fontSize: '16px', color: 'var(--black)' }}>{item.name}</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Qty: <span style={{ fontWeight: '500', color: 'var(--black)' }}>{item.qty}</span></div>
                            </div>
                          </div>
                          <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--black)' }}>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Cancellations;
