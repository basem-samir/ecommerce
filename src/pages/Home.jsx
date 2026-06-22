import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Smartphone, Monitor, Watch, Camera, Headphones, Gamepad, Truck, HeadphonesIcon, ShieldCheck, ArrowLeft, ArrowRight, ChevronRight, Apple } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('fashion')) return <Smartphone size={40} strokeWidth={1} />;
  if (name.includes('electronic') || name.includes('computer')) return <Monitor size={40} strokeWidth={1} />;
  if (name.includes('watch') || name.includes('sport')) return <Watch size={40} strokeWidth={1} />;
  if (name.includes('camera')) return <Camera size={40} strokeWidth={1} />;
  if (name.includes('headphone') || name.includes('audio')) return <Headphones size={40} strokeWidth={1} />;
  if (name.includes('gaming') || name.includes('toy')) return <Gamepad size={40} strokeWidth={1} />;
  if (name.includes('medicine') || name.includes('health') || name.includes('beauty')) return <ShieldCheck size={40} strokeWidth={1} />;
  if (name.includes('grocer') || name.includes('pet')) return <Truck size={40} strokeWidth={1} />;
  return <Monitor size={40} strokeWidth={1} />;
};

const Home = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [flashSaleIndex, setFlashSaleIndex] = useState(0);
  const [exploreIndex, setExploreIndex] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  
  const heroSlides = [
    {
      title: "iPhone 14 Series",
      heading: "Up to 10%\noff Voucher",
      image: "/images/iphone.png",
      logo: <Apple size={40} />
    },
    {
      title: "Audio Tech",
      heading: "Experience\nPremium Sound",
      image: "/images/headphones_slide.png",
      logo: <HeadphonesIcon size={40} />
    },
    {
      title: "Gaming Consoles",
      heading: "Next Gen\nPlayStation 5",
      image: "/images/ps5_slide.png",
      logo: <Gamepad size={40} />
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const flashSaleProducts = filteredProducts.filter(p => p.discount && p.discount > 0);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '140px' }}>
      
      {/* Hero Section */}
      <section className="mobile-stack" style={{ display: 'flex', gap: '40px', paddingTop: '40px' }}>
        {/* Sidebar Nav */}
        <aside className="hide-on-mobile" style={{ width: '220px', borderRight: '1px solid var(--border)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontWeight: '500' }}>
          {categories.map(cat => (
            <span 
              key={cat._id} 
              style={{ cursor: 'pointer', color: activeCategory === cat.name ? 'var(--primary)' : 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name}
              {cat.name.includes('Fashion') && <ChevronRight size={16} />}
            </span>
          ))}
        </aside>
        
        {/* Hero Banner */}
        <div 
          className="mobile-stack"
          style={{ flex: 1, backgroundColor: 'black', borderRadius: '4px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', padding: '40px' }}
        >
          {/* Left Content */}
          <div style={{ flex: 1, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              {heroSlides[heroSlideIndex].logo}
              <span style={{ fontSize: '16px', fontWeight: '400' }}>{heroSlides[heroSlideIndex].title}</span>
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: '600', lineHeight: '60px', marginBottom: '20px', fontFamily: 'var(--font-inter)', whiteSpace: 'pre-line' }}>
              {heroSlides[heroSlideIndex].heading}
            </h2>
            <div 
              onClick={() => navigate('/products')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', paddingBottom: '4px', borderBottom: '1px solid white', width: 'fit-content', cursor: 'pointer' }}
            >
              Shop Now <ArrowRight size={20} />
            </div>
          </div>
          
          {/* Right Image */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
            <img src={heroSlides[heroSlideIndex].image} alt="Slide" style={{ height: '350px', objectFit: 'contain' }} />
          </div>

          {/* Slider Dots */}
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 10 }}>
            {heroSlides.map((_, index) => (
              <div 
                key={index}
                onClick={() => setHeroSlideIndex(index)}
                style={{ 
                  width: heroSlideIndex === index ? '14px' : '12px', 
                  height: heroSlideIndex === index ? '14px' : '12px', 
                  borderRadius: '50%', 
                  backgroundColor: heroSlideIndex === index ? 'var(--primary)' : 'rgba(255, 255, 255, 0.5)', 
                  border: heroSlideIndex === index ? '2px solid white' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Header Component Pattern */}
      {/* We'll use this pattern for the different sections */}
      
      {/* Flash Sales */}
      {flashSaleProducts.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
            <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
            Today's
          </div>
          <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px' }}>
            <div className="mobile-stack" style={{ display: 'flex', alignItems: 'flex-end', gap: '40px' }}>
              <h2 className="heading-3">Flash Sales</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setFlashSaleIndex(prev => Math.max(prev - 1, 0))}
                disabled={flashSaleIndex === 0}
                style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: 'none', cursor: flashSaleIndex === 0 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: flashSaleIndex === 0 ? 0.5 : 1 }}
              ><ArrowLeft size={24} /></button>
              <button 
                onClick={() => setFlashSaleIndex(prev => Math.min(prev + 1, Math.max(0, flashSaleProducts.length - 4)))}
                disabled={flashSaleIndex >= flashSaleProducts.length - 4}
                style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: 'none', cursor: flashSaleIndex >= flashSaleProducts.length - 4 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: flashSaleIndex >= flashSaleProducts.length - 4 ? 0.5 : 1 }}
              ><ArrowRight size={24} /></button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            {flashSaleProducts.slice(flashSaleIndex, flashSaleIndex + 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/products')}>View All Products</button>
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
          <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
          Categories
        </div>
        <h2 className="heading-3" style={{ marginBottom: '60px' }}>Browse By Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '30px' }}>
          {/* Category Item */}
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat.name;
            return (
            <div key={cat._id || i} onClick={() => handleCategoryClick(cat.name)} style={{ 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              padding: '24px 0', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'var(--white)' : 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              {getCategoryIcon(cat.name)}
              <span style={{ fontWeight: '500', textAlign: 'center', padding: '0 8px' }}>{cat.name}</span>
            </div>
            );
          })}
        </div>
      </section>

      {/* Best Selling Products */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
          <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
          This Month
        </div>
        <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', gap: '16px' }}>
          <h2 className="heading-3">Best Selling Products</h2>
          <button className="btn-primary" onClick={() => navigate('/products')}>View All</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {filteredProducts.slice(4, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>


      {/* Explore Our Products */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
          <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
          Our Products
        </div>
        <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', gap: '16px' }}>
          <h2 className="heading-3">Explore Our Products</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setExploreIndex(prev => Math.max(prev - 4, 0))}
              disabled={exploreIndex === 0}
              style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: 'none', cursor: exploreIndex === 0 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: exploreIndex === 0 ? 0.5 : 1 }}
            ><ArrowLeft size={24} /></button>
            <button 
              onClick={() => setExploreIndex(prev => Math.min(prev + 4, Math.max(0, filteredProducts.length - 8)))}
              disabled={exploreIndex >= filteredProducts.length - 8}
              style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: 'none', cursor: exploreIndex >= filteredProducts.length - 8 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: exploreIndex >= filteredProducts.length - 8 ? 0.5 : 1 }}
            ><ArrowRight size={24} /></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {filteredProducts.slice(exploreIndex, exploreIndex + 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/products')}>View All Products</button>
        </div>
      </section>

      {/* New Arrival */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
          <div style={{ width: '20px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
          Featured
        </div>
        <h2 className="heading-3" style={{ marginBottom: '60px' }}>New Arrival</h2>
        
        <div className="mobile-stack" style={{ display: 'flex', gap: '30px' }}>
          {/* Left Large Panel */}
          <div style={{ flex: 1, backgroundColor: 'black', borderRadius: '4px', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
            <img src="/images/ps5.png" alt="PS5" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '32px', left: '32px', color: 'white', maxWidth: '240px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', fontFamily: 'var(--font-inter)' }}>PlayStation 5</h3>
              <p style={{ fontSize: '14px', marginBottom: '16px', color: '#FAFAFA' }}>Black and White version of the PS5 coming out on sale.</p>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Shop Now</a>
            </div>
          </div>
          
          {/* Right Panels */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Top Right */}
            <div style={{ flex: 1, backgroundColor: '#0D0D0D', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/womens.png" alt="Women's Collection" style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: 'white', maxWidth: '250px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', fontFamily: 'var(--font-inter)' }}>Women's Collections</h3>
                <p style={{ fontSize: '14px', marginBottom: '16px', color: '#FAFAFA' }}>Featured woman collections that give you another vibe.</p>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Shop Now</a>
              </div>
            </div>
            {/* Bottom Right Split */}
            <div style={{ flex: 1, display: 'flex', gap: '30px' }}>
              <div style={{ flex: 1, backgroundColor: 'black', borderRadius: '4px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', backgroundColor: '#D9D9D9', opacity: '0.3', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>
                <img src="/images/speakers.png" alt="Speakers" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: 'white', zIndex: 2 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>Speakers</h3>
                  <p style={{ fontSize: '14px', marginBottom: '8px', color: '#FAFAFA' }}>Amazon wireless speakers</p>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Shop Now</a>
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'black', borderRadius: '4px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', backgroundColor: '#D9D9D9', opacity: '0.3', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>
                <img src="/images/perfume.png" alt="Perfume" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: 'white', zIndex: 2 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>Perfume</h3>
                  <p style={{ fontSize: '14px', marginBottom: '8px', color: '#FAFAFA' }}>GUCCI INTENSE OUD EDP</p>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Shop Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mobile-stack" style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: 'var(--black)', color: 'var(--white)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Truck size={32} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>FREE AND FAST DELIVERY</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Free delivery for all orders over $140</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: 'var(--black)', color: 'var(--white)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <HeadphonesIcon size={32} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>24/7 CUSTOMER SERVICE</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Friendly 24/7 customer support</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: 'var(--black)', color: 'var(--white)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ShieldCheck size={32} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>MONEY BACK GUARANTEE</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>We return money within 30 days</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
