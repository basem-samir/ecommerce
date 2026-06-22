import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };
  return (
    <div className="container" style={{ display: 'flex', gap: '120px', marginTop: '60px', marginBottom: '140px' }}>
      
      {/* Side Image */}
      <div style={{ flex: 1.2, backgroundColor: '#CBE4E8', height: '780px', display: 'flex', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000" alt="Sign Up" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '500', marginBottom: '24px', fontFamily: 'var(--font-inter)' }}>Create an account</h1>
        <p style={{ marginBottom: '48px', color: 'var(--black)' }}>Enter your details below</p>
        
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '370px' }}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
            required
          />
          <input 
            type="text" 
            placeholder="Email or Phone Number" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderBottom: '1px solid var(--black)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0', backgroundColor: 'transparent', padding: '8px 0' }} 
            required
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px 0' }}>Create Account</button>
            <button className="btn-outline" style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Already have account? <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'underline', fontWeight: '500', marginLeft: '8px' }}>Log in</Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SignUp;
