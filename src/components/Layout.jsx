import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh', padding: '40px 0' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
