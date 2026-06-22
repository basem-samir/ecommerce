import React, { useContext, useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);

  const handleMoveAllToBag = () => {
    wishlistItems.forEach(item => addToCart(item));
    clearWishlist();
  };

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        const data = await res.json();
        setRecommended(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching recommended:', error);
      }
    };
    fetchRecommended();
  }, []);
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '80px', padding: '40px 0' }}>

      {/* Wishlist Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '400' }}>Wishlist ({wishlistItems.length})</h2>
          <button className="btn-outline" onClick={handleMoveAllToBag}>Move All To Bag</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
          {wishlistItems.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>Your wishlist is empty.</div>
          ) : (
            wishlistItems.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Just For You Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600' }}>
            <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
            <span style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '400' }}>Just For You</span>
          </div>
          <button className="btn-outline" onClick={() => navigate('/products')}>See All</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
          {recommended.map(rp => (
            <ProductCard key={rp._id} product={rp} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Wishlist;
