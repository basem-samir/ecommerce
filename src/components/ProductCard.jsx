import React, { useContext, useState } from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const isDiscountActive = product.discount && (!product.discountEndDate || new Date(product.discountEndDate) > Date.now());

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const isWishlisted = wishlistItems.some(item => item._id === product._id);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast('Added to Cart');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', cursor: 'pointer' }} onClick={handleCardClick}>
      
      {/* Product Image Box */}
      <div style={{ backgroundColor: 'var(--secondary)', height: '250px', borderRadius: '4px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* Discount Badge */}
        {isDiscountActive && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}>
            -{product.discount}%
          </div>
        )}
        
        {/* Actions */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            className={`action-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isWishlisted) {
                removeFromWishlist(product._id);
                showToast('Removed from Wishlist');
              } else {
                addToWishlist(product);
                showToast('Added to Wishlist');
              }
            }}
          >
            <Heart size={20} />
          </div>
          <div className="action-icon-btn">
            <Eye size={20} />
          </div>
        </div>
        
        {/* Product Image */}
        <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Add to Cart Overlay */}
        <div 
          style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--black)', color: 'var(--white)', textAlign: 'center', padding: '12px', cursor: 'pointer', opacity: '0', transition: 'opacity 0.3s' }} 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Add To Cart
        </div>
      </div>
      
      {/* Product Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{product.name || 'HAVIT HV-G92 Gamepad'}</h3>
        <div style={{ display: 'flex', gap: '12px', fontWeight: '500' }}>
          {isDiscountActive ? (
            <>
              <span style={{ color: 'var(--primary)' }}>${(product.price - (product.price * product.discount / 100)).toFixed(2)}</span>
              <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through' }}>${product.price?.toFixed(2)}</span>
            </>
          ) : (
            <span style={{ color: 'var(--primary)' }}>${product.price?.toFixed(2) || '120.00'}</span>
          )}
        </div>

      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
