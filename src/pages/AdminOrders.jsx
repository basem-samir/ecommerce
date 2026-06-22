import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Loader from '../components/Loader';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If not admin, redirect to home
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchAllOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch all orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllOrders();
    }
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAllOrders(); // Refresh after update
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Order Management</h2>
          <input 
            type="text" 
            placeholder="Search by ID, name, or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: '8px 16px', border: '1px solid #eaeaea', borderRadius: '4px', width: '300px' }} 
          />
        </div>
      
      {loading ? (
        <Loader type="skeleton-table" />
      ) : orders.length === 0 ? (
        <p>No orders found in the system.</p>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>ORDER ID</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>USER</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>DATE</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>TOTAL</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(order => 
                  order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                ).map(order => {
                  const currentStatus = order.status || 'Processing';
                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                      <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '14px' }}>{order._id}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{order.user?.name || 'Unknown User'}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>${order.totalPrice?.toFixed(2)}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          backgroundColor: currentStatus === 'Delivered' ? '#22c55e22' : 
                                           (currentStatus === 'Cancelled' || currentStatus === 'Return Rejected') ? '#ef444422' : 
                                           currentStatus === 'Return Requested' ? '#f9731622' : '#eab30822',
                          color: currentStatus === 'Delivered' ? '#22c55e' : 
                                 (currentStatus === 'Cancelled' || currentStatus === 'Return Rejected') ? '#ef4444' : 
                                 currentStatus === 'Return Requested' ? '#f97316' : '#eab308',
                          padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'
                        }}>
                          {currentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {currentStatus === 'Processing' && (
                            <button onClick={() => updateOrderStatus(order._id, 'Shipped')} style={{ padding: '6px 12px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Mark Shipped</button>
                          )}
                          {currentStatus === 'Shipped' && (
                            <button onClick={() => updateOrderStatus(order._id, 'Delivered')} style={{ padding: '6px 12px', border: 'none', backgroundColor: '#22c55e', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Mark Delivered</button>
                          )}
                          {currentStatus === 'Return Requested' && (
                            <>
                              <button onClick={() => updateOrderStatus(order._id, 'Returned')} style={{ padding: '6px 12px', border: 'none', backgroundColor: '#6b7280', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Approve Return</button>
                              <button onClick={() => updateOrderStatus(order._id, 'Return Rejected')} style={{ padding: '6px 12px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Reject Return</button>
                            </>
                          )}
                          {['Delivered', 'Returned', 'Cancelled', 'Return Rejected'].includes(currentStatus) && (
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminOrders;
