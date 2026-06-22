import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const Products = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const loading = productsLoading || categoriesLoading;
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');
  const [categorySearch, setCategorySearch] = useState('');

  // Filter & Sort State
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('default');
  
  // Pagination State
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const productsPerPage = 12;

  const setCurrentPage = (page) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page);
    }
    setSearchParams(params);
  };

  // Products and Categories are now fetched by hooks

  // Reset to page 1 when filters change
  const isMounted = React.useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      setCurrentPage(1);
    } else {
      isMounted.current = true;
    }
  }, [categoryFilter, searchFilter, minPrice, maxPrice, sortOption]);

  // Apply Filters
  let filteredProducts = products.filter(p => {
    let match = true;
    if (categoryFilter && p.category !== categoryFilter) match = false;
    if (searchFilter && !p.name.toLowerCase().includes(searchFilter.toLowerCase())) match = false;
    
    if (minPrice && p.price < Number(minPrice)) match = false;
    if (maxPrice && p.price > Number(maxPrice)) match = false;
    
    return match;
  });

  // Apply Sorting
  if (sortOption === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Apply Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    if (typeof pageNumber === 'function') {
      setCurrentPage((prev) => {
        const next = pageNumber(prev);
        window.scrollTo({ top: 0, behavior: 'auto' });
        return next;
      });
    } else {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortOption('default');
    setCategorySearch('');
    navigate('/products');
  };

  const filteredSidebarCategories = categories.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="container mobile-stack" style={{ paddingTop: '40px', paddingBottom: '40px', display: 'flex', gap: '40px' }}>
      
      {/* Sidebar Filters */}
      <aside className="products-sidebar" style={{ width: '100%', maxWidth: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Categories */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Categories</h3>
          <input 
            type="text" 
            placeholder="Find category..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '16px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
            <span 
              onClick={() => navigate('/products')}
              style={{ cursor: 'pointer', color: !categoryFilter ? 'var(--primary)' : 'var(--text-secondary)' }}
            >
              All Categories
            </span>
            {filteredSidebarCategories.map(cat => (
              <span 
                key={cat._id}
                onClick={() => handleCategoryClick(cat.name)}
                style={{ cursor: 'pointer', color: categoryFilter === cat.name ? 'var(--primary)' : 'var(--text-secondary)' }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Price Range</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button 
          onClick={handleClearFilters}
          style={{ padding: '12px', backgroundColor: 'var(--secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
        >
          Clear Filters
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, width: '100%', minWidth: 0 }}>
        <div className="mobile-stack products-search-sort" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
          <div style={{ width: '100%' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {searchFilter ? `Search Results for "${searchFilter}"` : categoryFilter ? `${categoryFilter} Products` : 'All Products'}
            </h1>
            <span style={{ color: 'var(--text-secondary)' }}>
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results
            </span>
          </div>
          
          {/* Search and Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search products by name..."
              value={searchFilter || ''}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('search', e.target.value);
                } else {
                  params.delete('search');
                }
                setSearchParams(params);
              }}
              style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '4px', flex: '1 1 200px' }}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '500' }}>Sort By:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'white' }}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', marginBottom: '40px' }}>
             <Loader type="skeleton-card" />
             <Loader type="skeleton-card" />
             <Loader type="skeleton-card" />
             <Loader type="skeleton-card" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <h3>No products found matching your criteria.</h3>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', marginBottom: '40px' }}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '60px' }}>
                <button 
                  onClick={() => paginate(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      style={{ 
                        width: '40px', height: '40px', borderRadius: '4px', 
                        border: page === currentPage ? 'none' : '1px solid var(--border)', 
                        backgroundColor: page === currentPage ? 'var(--primary)' : 'white',
                        color: page === currentPage ? 'white' : 'var(--text-primary)',
                        fontWeight: '500', cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => paginate(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
