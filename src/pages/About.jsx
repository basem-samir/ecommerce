import React, { useState } from 'react';
import { Truck, HeadphonesIcon, ShieldCheck, Store, CircleDollarSign, ShoppingBag, Banknote, ChevronLeft, ChevronRight } from 'lucide-react';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const teamMembers = [
    { name: 'Tom Cruise', role: 'Founder & Chairman', img: '/images/team_1.png' },
    { name: 'Emma Watson', role: 'Managing Director', img: '/images/team_2.png' },
    { name: 'Will Smith', role: 'Product Designer', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
    { name: 'Scarlett Johansson', role: 'Marketing Manager', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
    { name: 'Chris Evans', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' }
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '140px', marginBottom: '140px' }}>
      
      {/* Story Section */}
      <section className="container" style={{ display: 'flex', alignItems: 'center', gap: '80px', marginTop: '40px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px' }}>
            Home / <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>About</span>
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: '600', marginBottom: '40px', fontFamily: 'var(--font-inter)' }}>Our Story</h1>
          <p style={{ fontSize: '16px', lineHeight: '26px', marginBottom: '24px' }}>
            Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '26px' }}>
            Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.
          </p>
        </div>
        <div style={{ flex: 1.2, height: '600px', display: 'flex', justifyContent: 'flex-end' }}>
           <img src="/images/about_hero.png" alt="Our Story" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
          {[
            { num: '10.5k', text: 'Sellers active our site', icon: <Store size={32} /> },
            { num: '33k', text: 'Mopnthly Produduct Sale', icon: <CircleDollarSign size={32} /> },
            { num: '45.5k', text: 'Customer active in our site', icon: <ShoppingBag size={32} /> },
            { num: '25k', text: 'Anual gross sale in our site', icon: <Banknote size={32} /> },
          ].map((stat, i) => (
            <div key={i} style={{ 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              padding: '30px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px',
              backgroundColor: stat.active ? 'var(--primary)' : 'transparent',
              color: stat.active ? 'var(--white)' : 'var(--text-primary)'
            }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: stat.active ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: stat.active ? 'var(--white)' : 'var(--black)', color: stat.active ? 'var(--black)' : 'var(--white)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {stat.icon}
                </div>
              </div>
              <h3 style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'var(--font-inter)' }}>{stat.num}</h3>
              <p style={{ fontSize: '16px' }}>{stat.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container" style={{ position: 'relative' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', transform: `translateX(calc(-${currentSlide * 33.333}% - ${currentSlide * 10}px))`, transition: 'transform 0.5s ease' }}>
            {teamMembers.map((member, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', minWidth: 'calc(33.333% - 20px)' }}>
                <div style={{ backgroundColor: '#F5F5F5', height: '430px', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '0 20px' }}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '500', fontFamily: 'var(--font-inter)', marginBottom: '8px', letterSpacing: '0.04em' }}>{member.name}</h3>
                <p style={{ fontSize: '16px', marginBottom: '16px' }}>{member.role}</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="https://twitter.com/login" target="_blank" rel="noopener noreferrer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
                  <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                  <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          style={{ position: 'absolute', top: '35%', left: '-24px', transform: 'translateY(-50%)', width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: currentSlide === 0 ? 'default' : 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', opacity: currentSlide === 0 ? 0 : 1, transition: 'opacity 0.3s ease' }}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => Math.min(teamMembers.length - 3, prev + 1))}
          style={{ position: 'absolute', top: '35%', right: '-24px', transform: 'translateY(-50%)', width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: currentSlide === teamMembers.length - 3 ? 'default' : 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', opacity: currentSlide === teamMembers.length - 3 ? 0 : 1, transition: 'opacity 0.3s ease' }}
          disabled={currentSlide === teamMembers.length - 3}
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Carousel Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {[0, 1, 2].map(idx => (
            <div 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{ 
                width: currentSlide === idx ? '14px' : '12px', 
                height: currentSlide === idx ? '14px' : '12px', 
                borderRadius: '50%', 
                backgroundColor: currentSlide === idx ? 'var(--primary)' : 'var(--border)', 
                border: currentSlide === idx ? '2px solid white' : 'none', 
                outline: currentSlide === idx ? '1px solid var(--primary)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="container" style={{ display: 'flex', justifyContent: 'center', gap: '88px' }}>
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

export default About;
