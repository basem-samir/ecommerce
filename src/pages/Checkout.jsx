import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [addressInfo, setAddressInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    address: '',
    city: '',
    phone: '',
    email: user?.email || ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    setCouponSuccess('');
    
    if (!user) {
      setCouponError('You must be logged in to use coupons.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/coupons/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      
      if (res.ok) {
        setAppliedCoupon({ code: data.code, discountPercent: data.discountPercent });
        setCouponSuccess(`Coupon ${data.code} applied! (${data.discountPercent}% off)`);
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Network error');
      setAppliedCoupon(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: addressInfo,
        paymentMethod: 'Cash on delivery',
        totalPrice: total,
        couponCode: appliedCoupon?.code || undefined
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        clearCart();
        setShowSuccessModal(true);
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      alert('Server error.');
    }
  };
  return (
    <div className="container">
      <div style={{ padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
        Account / My Account / Product / View Cart / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>CheckOut</span>
      </div>

      <h1 style={{ fontSize: '36px', fontWeight: '500', marginBottom: '40px', fontFamily: 'var(--font-inter)' }}>Billing Details</h1>

      <div style={{ display: 'flex', gap: '140px' }}>
        
        {/* Billing Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>First Name<span style={{ color: 'var(--primary)' }}>*</span></label>
            <input type="text" style={{ backgroundColor: 'var(--secondary)' }} value={addressInfo.firstName} onChange={e => setAddressInfo({...addressInfo, firstName: e.target.value})} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Company Name</label>
            <input type="text" style={{ backgroundColor: 'var(--secondary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Street Address<span style={{ color: 'var(--primary)' }}>*</span></label>
            <input type="text" style={{ backgroundColor: 'var(--secondary)' }} value={addressInfo.address} onChange={e => setAddressInfo({...addressInfo, address: e.target.value})} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Apartment, floor, etc. (optional)</label>
            <input type="text" style={{ backgroundColor: 'var(--secondary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Town/City<span style={{ color: 'var(--primary)' }}>*</span></label>
            <input type="text" style={{ backgroundColor: 'var(--secondary)' }} value={addressInfo.city} onChange={e => setAddressInfo({...addressInfo, city: e.target.value})} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Phone Number<span style={{ color: 'var(--primary)' }}>*</span></label>
            <input type="text" style={{ backgroundColor: 'var(--secondary)' }} value={addressInfo.phone} onChange={e => setAddressInfo({...addressInfo, phone: e.target.value})} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Email Address<span style={{ color: 'var(--primary)' }}>*</span></label>
            <input type="email" style={{ backgroundColor: 'var(--secondary)' }} value={addressInfo.email} onChange={e => setAddressInfo({...addressInfo, email: e.target.value})} />
          </div>



        </div>

        {/* Order Summary */}
        <div style={{ width: '420px', paddingTop: '32px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '32px' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '54px', height: '54px', backgroundColor: 'var(--secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <img src={item.imageUrl || 'https://via.placeholder.com/54'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <span>{item.name}</span>
                </div>
                <span>${item.price}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px', color: 'var(--success)' }}>
              <span>Discount ({appliedCoupon.discountPercent}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input type="radio" name="payment" id="cash" style={{ accentColor: 'var(--black)', width: '20px', height: '20px' }} defaultChecked />
              <label htmlFor="cash">Cash on delivery</label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--black)', padding: '16px 24px' }} />
              <button className="btn-primary" style={{ padding: '16px 24px' }} onClick={handleApplyCoupon}>Apply Coupon</button>
            </div>
            {couponError && <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '500' }}>{couponError}</span>}
            {couponSuccess && <span style={{ color: 'var(--success)', fontSize: '14px', fontWeight: '500' }}>{couponSuccess}</span>}
          </div>

          <button className="btn-primary" style={{ padding: '16px 48px' }} onClick={handlePlaceOrder}>Place Order</button>

        </div>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#22c55e22', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: 'var(--black)' }}>Order Placed Successfully!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>Thank you for your purchase. We've received your order and are currently processing it.</p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/orders');
              }} 
              style={{ width: '100%', padding: '14px 20px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', fontSize: '16px', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(219, 68, 68, 0.2)' }}
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
