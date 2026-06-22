import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderToCancel}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchOrders(); // Refresh orders after successful cancellation
        setShowCancelModal(false);
        setOrderToCancel(null);
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to cancel order', error);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleReturn = async (orderId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/return`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchOrders(); // Refresh orders after successful return request
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to return order', error);
    }
  };

  const handleCancelReturn = async (orderId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/cancel-return`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchOrders(); 
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to cancel return', error);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0', marginBottom: '40px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>My Orders</span>
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
            <Link to="/orders" style={{ color: 'var(--primary)', marginLeft: '16px', textDecoration: 'none' }}>Order History</Link>
            <Link to="/returns" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Returns</Link>
            <Link to="/cancellations" style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'none' }}>My Cancellations</Link>
          </div>



        </aside>

        {/* Orders Content */}
        <div style={{ flex: 1, padding: '40px 80px', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--primary)', marginBottom: '24px' }}>My Orders</h2>
          
          {loading ? (
            <Loader type="skeleton-table" />
          ) : orders.filter(o => ['Processing', 'Shipped', 'Delivered'].includes(o.status || 'Processing')).length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You have no active orders. Check your Returns or Cancellations tabs for past orders.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.filter(o => ['Processing', 'Shipped', 'Delivered'].includes(o.status || 'Processing')).map(order => {
                const currentStatus = order.status || 'Processing';
                
                let statusColor = 'var(--primary)';
                if (currentStatus === 'Delivered') statusColor = '#22c55e'; // Green
                else if (currentStatus === 'Processing') statusColor = '#eab308'; // Yellow
                else if (currentStatus === 'Cancelled' || currentStatus === 'Return Rejected') statusColor = '#ef4444'; // Red
                else if (currentStatus === 'Return Requested') statusColor = '#f97316'; // Orange
                else if (currentStatus === 'Returned') statusColor = '#6b7280'; // Gray

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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      {order.orderItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: index < order.orderItems.length - 1 ? '1px solid #eaeaea' : 'none' }}>
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

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #eaeaea', paddingTop: '24px' }}>
                      {currentStatus === 'Processing' && (
                        <button onClick={() => handleCancelClick(order._id)} style={{ padding: '12px 28px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s ease' }}>
                          Cancel Order
                        </button>
                      )}
                      {currentStatus === 'Shipped' && (
                        <button disabled style={{ padding: '12px 28px', border: '1px solid #eaeaea', backgroundColor: '#fafafa', color: 'var(--text-secondary)', cursor: 'not-allowed', borderRadius: '6px', fontWeight: '600' }}>
                          In Transit...
                        </button>
                      )}
                      {currentStatus === 'Delivered' && (
                        <button onClick={() => handleReturn(order._id)} style={{ padding: '12px 28px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                          Request Return
                        </button>
                      )}
                      {currentStatus === 'Return Requested' && (
                        <button onClick={() => handleCancelReturn(order._id)} style={{ padding: '12px 28px', border: '1px solid #f97316', color: '#f97316', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s ease' }}>
                          Revoke Return Request
                        </button>
                      )}
                      {(currentStatus === 'Cancelled' || currentStatus === 'Returned' || currentStatus === 'Return Rejected') && (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                          No further actions available.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>Cancel Order</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.5' }}>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={closeCancelModal} style={{ padding: '10px 20px', border: '1px solid #eaeaea', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px', fontWeight: '500' }}>Keep Order</button>
              <button onClick={confirmCancel} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', borderRadius: '6px', fontWeight: '500' }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
