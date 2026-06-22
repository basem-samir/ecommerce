import React from 'react';
import './Loader.css';

const Loader = ({ type = 'spinner' }) => {
  if (type === 'skeleton-card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-img"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    );
  }

  if (type === 'skeleton-table') {
    return (
      <div className="skeleton-table">
        <div className="skeleton-row header"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
