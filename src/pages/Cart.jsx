import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, updateCartItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState(null);
  const [editSize, setEditSize] = useState('');
  const [editColor, setEditColor] = useState('');
  


  const handleClearCart = () => {
    clearCart();
  };

  const handleEditClick = (item) => {
    setEditingItem(item.cartItemId || item.product);
    setEditSize(item.size || '');
    setEditColor(item.color || '');
  };

  const handleSaveEdit = (item) => {
    updateCartItem(item.cartItemId || item.product, editSize, editColor);
    setEditingItem(null);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal;

  return (
    <div className="container">
      <div style={{ padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
        Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Cart</span>
      </div>

      {/* Cart Table Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', padding: '24px 40px', backgroundColor: 'var(--white)', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px', marginBottom: '40px', fontWeight: '500', alignItems: 'center' }}>
        <div>Product</div>
        <div>Price</div>
        <div>Size</div>
        <div>Color</div>
        <div>Quantity</div>
        <div style={{ textAlign: 'right' }}>Subtotal</div>
      </div>

      {/* Cart Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '40px' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Your cart is empty.</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.cartItemId || item.product} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center', padding: '24px 40px', backgroundColor: 'var(--white)', boxShadow: '0px 1px 13px rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '54px', height: '54px', backgroundColor: 'var(--secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <img src={item.imageUrl || 'https://via.placeholder.com/54'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div 
                    onClick={() => removeFromCart(item.cartItemId || item.product)}
                    style={{ position: 'absolute', top: '-8px', left: '-8px', width: '20px', height: '20px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', cursor: 'pointer' }}
                  >x</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{item.name}</span>
                  {editingItem === (item.cartItemId || item.product) ? (
                    <span onClick={() => handleSaveEdit(item)} style={{ color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</span>
                  ) : (
                    <span onClick={() => handleEditClick(item)} style={{ color: '#007BFF', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Edit Options</span>
                  )}
                </div>
              </div>
              <div>${item.price}</div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {editingItem === (item.cartItemId || item.product) ? (
                  <select value={editSize} onChange={(e) => setEditSize(e.target.value)} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                    <option value="">-</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                ) : (
                  item.size || '-'
                )}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {editingItem === (item.cartItemId || item.product) ? (
                  <select value={editColor} onChange={(e) => setEditColor(e.target.value)} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                    <option value="">-</option>
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                  </select>
                ) : (
                  item.color || '-'
                )}
              </div>
              <div>
                <input 
                  type="number" 
                  value={item.qty} 
                  onChange={(e) => updateQuantity(item.cartItemId || item.product, parseInt(e.target.value) || 1)}
                  min="1"
                  style={{ width: '72px', padding: '8px 12px', border: '1px solid var(--border)', backgroundColor: 'transparent' }} 
                />
              </div>
              <div style={{ textAlign: 'right' }}>${item.price * item.qty}</div>
            </div>
          ))
        )}
      </div>

      {/* Cart Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '80px' }}>
        <button className="btn-outline" onClick={() => navigate('/')}>Return To Shop</button>
        <button className="btn-outline" onClick={handleClearCart}>Clear Cart</button>
      </div>

      {/* Coupon & Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        {/* Coupon Spacer (previously coupon input) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        </div>

        {/* Cart Total */}
        <div style={{ width: '470px', border: '1.5px solid var(--black)', borderRadius: '4px', padding: '32px 24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px' }}>Cart Total</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          


          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/checkout">
              <button className="btn-primary">Proceed to checkout</button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
