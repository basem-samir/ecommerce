import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Heart, Truck, RefreshCcw, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProductById, getProducts } from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const isWishlisted = product ? wishlistItems.some(item => item._id === product._id) : false;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);

          // Fetch related products
          // To keep it simple, we fetch all products and filter by category (or we could make a query parameter)
          // Since getProducts doesn't support query params yet in our implementation, we fetch all and filter.
          const allProducts = await getProducts();
          if (allProducts) {
             setRelatedProducts(allProducts.filter(p => p.category === data.category && p._id !== data._id).slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;

    if (product.discount && product.discountEndDate) {
      const targetDate = new Date(product.discountEndDate).getTime();
      
      const updateTimer = () => {
        const now = Date.now();
        const distance = targetDate - now;

        if (distance <= 0) {
          setTimeLeft(null);
          setIsDiscountActive(false);
        } else {
          setIsDiscountActive(true);
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft({ days, hours, minutes, seconds });
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    } else if (product.discount) {
      setIsDiscountActive(true);
      setTimeLeft(null);
    } else {
      setIsDiscountActive(false);
      setTimeLeft(null);
    }
  }, [product]);

  if (!product) return (
    <div className="container" style={{ padding: '40px 0' }}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
      <div style={{ padding: '40px 0' }}>
        <div style={{ width: '200px', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      </div>
      <div className="mobile-stack" style={{ display: 'flex', gap: '40px', marginBottom: '140px' }}>
        {/* Images Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, maxWidth: '500px' }}>
          <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, aspectRatio: '1', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '70%', height: '32px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ width: '40%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ width: '30%', height: '32px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '16px' }}></div>
          
          <div style={{ width: '100%', height: '80px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '16px' }}></div>
          
          <div style={{ width: '50%', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '16px' }}></div>
          <div style={{ width: '60%', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '24px' }}></div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
             <div style={{ width: '100px', height: '48px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
             <div style={{ flex: 1, height: '48px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
             <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [
    product.imageUrl || 'https://via.placeholder.com/400'
  ];

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div style={{ padding: '40px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
        Account / {product.category} / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{product.name}</span>
      </div>
      <div className="mobile-stack" style={{ display: 'flex', gap: '40px', marginBottom: '140px' }}>
        {/* Images Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, maxWidth: '500px' }}>
          {/* Main Image */}
          <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <img src={images[selectedImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Sub Images (Gallery) */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '16px' }}>
              {images.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedImage(index)}
                  style={{ 
                    flex: 1, 
                    aspectRatio: '1', 
                    backgroundColor: 'var(--secondary)', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid var(--primary)' : '2px solid transparent',
                    opacity: selectedImage === index ? 1 : 0.6,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--success)', fontSize: '14px', fontWeight: '500' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            {isDiscountActive ? (
              <>
                <span style={{ fontSize: '24px', fontWeight: '400' }}>
                  ${(product.price - (product.price * product.discount / 100)).toFixed(2)}
                </span>
                <span style={{ fontSize: '20px', fontWeight: '400', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                  ${product.price?.toFixed(2)}
                </span>
                <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: '500' }}>
                  {product.discount}% OFF
                </span>
                {timeLeft && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#fff', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase' }}>Ends in:</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                      {String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                )}
              </>
            ) : (
              <span style={{ fontSize: '24px', fontWeight: '400' }}>${product.price?.toFixed(2)}</span>
            )}
          </div>

          <p style={{ fontSize: '14px', lineHeight: '21px', borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
            {product.description}
          </p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
              <span style={{ fontSize: '20px', fontWeight: '400' }}>Colours:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.colors.map(color => (
                  <div 
                    key={color} 
                    onClick={() => setSelectedColor(color)} 
                    title={color}
                    style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color.toLowerCase(), border: selectedColor === color ? '2px solid black' : '1px solid #eaeaea', cursor: 'pointer' }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
              <span style={{ fontSize: '20px', fontWeight: '400' }}>Size:</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                {product.sizes.map(size => (
                  <div 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{ padding: '0 8px', minWidth: '32px', height: '32px', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', cursor: 'pointer', backgroundColor: selectedSize === size ? 'var(--primary)' : 'transparent', color: selectedSize === size ? 'white' : 'inherit' }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {/* Quantity */}
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <button style={{ padding: '10px 14px', backgroundColor: 'transparent', borderRight: '1px solid var(--border)' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={20} /></button>
              <div style={{ width: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: '500' }}>{quantity}</div>
              <button style={{ padding: '10px 14px', backgroundColor: 'var(--primary)', color: 'var(--white)', border: 'none' }} onClick={() => setQuantity(quantity + 1)}><Plus size={20} /></button>
            </div>
            
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
              addToCart({ ...product, color: selectedColor, size: selectedSize }, quantity);
              showToast('Added to Cart');
            }}>Buy Now</button>
            
            <div 
              style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: isWishlisted ? 'var(--primary)' : 'transparent', color: isWishlisted ? 'white' : 'inherit' }}
              onClick={() => {
                if (isWishlisted) {
                  removeFromWishlist(product._id);
                  showToast('Removed from Wishlist');
                } else {
                  addToWishlist(product);
                  showToast('Added to Wishlist');
                }
              }}
            >
              <Heart size={24} fill={isWishlisted ? 'white' : 'none'} color={isWishlisted ? 'white' : 'currentColor'} />
            </div>
          </div>

          {/* Features Box */}
          <div style={{ border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', borderBottom: '1px solid var(--border)' }}>
              <Truck size={40} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Free Delivery</h4>
                <a href="#" style={{ fontSize: '12px', textDecoration: 'underline', fontWeight: '500' }}>Enter your postal code for Delivery Availability</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <RefreshCcw size={40} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Return Delivery</h4>
                <p style={{ fontSize: '12px', fontWeight: '500' }}>Free 30 Days Delivery Returns. <a href="#" style={{ textDecoration: 'underline' }}>Details</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div style={{ marginBottom: '140px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600', marginBottom: '60px' }}>
          <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
          Related Item
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {relatedProducts.map(rp => (
            <ProductCard key={rp._id} product={rp} />
          ))}
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

export default ProductDetails;
