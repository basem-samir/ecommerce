import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Loader from '../components/Loader';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    images: [],
    category: '',
    stock: '',
    discount: '',
    discountEndDate: '',
    colors: '',
    sizes: '',
  });
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl || '',
        images: product.images || [],
        category: product.category || '',
        stock: product.stock || 0,
        discount: product.discount || '',
        discountEndDate: product.discountEndDate ? new Date(product.discountEndDate).toISOString().slice(0, 16) : '',
        colors: product.colors ? product.colors.join(', ') : '',
        sizes: product.sizes ? product.sizes.join(', ') : '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        images: [],
        category: '',
        stock: '',
        discount: '',
        discountEndDate: '',
        colors: '',
        sizes: '',
      });
    }
    setShowModal(true);
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length > 5) {
      alert('You can only upload up to 5 images at a time.');
      return;
    }

    const formDataBody = new FormData();
    files.forEach(file => {
      formDataBody.append('images', file);
    });
    
    setUploading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataBody,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, images: [...formData.images, ...data.urls], imageUrl: data.urls[0] || formData.imageUrl });
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${editingProduct._id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        discount: formData.discount === '' ? undefined : Number(formData.discount),
        discountEndDate: formData.discountEndDate || undefined,
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchProducts();
        handleCloseModal();
        if (!editingProduct) {
          showToast('Product added successfully!');
          setCurrentPage(1); // Reset to first page to see the new item
        } else {
          showToast('Product updated successfully!');
        }
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchProducts();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Product Management</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              style={{ padding: '8px 16px', border: '1px solid #eaeaea', borderRadius: '4px', width: '250px' }} 
            />
            <button onClick={() => handleOpenModal()} style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>+ Add Product</button>
          </div>
        </div>
        
        {loading ? (
          <Loader type="skeleton-table" />
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="table-responsive-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>PRODUCT</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>PRICE</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>STOCK</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                            {(product.images && product.images[0]) || product.imageUrl ? <img src={(product.images && product.images[0]) || product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
                          </div>
                          <span style={{ fontWeight: '500', fontSize: '14px' }}>{product.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>${product.price?.toFixed(2)}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{product.stock}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleOpenModal(product)} style={{ padding: '6px 12px', border: '1px solid #eaeaea', backgroundColor: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Edit</button>
                          <button onClick={() => handleDeleteClick(product._id)} style={{ padding: '6px 12px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', borderTop: '1px solid #eaeaea', gap: '8px' }}>
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => paginate(currentPage - 1)}
                  style={{ padding: '8px 16px', border: '1px solid #eaeaea', backgroundColor: 'white', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#ccc' : 'var(--text-primary)' }}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i + 1} 
                    onClick={() => paginate(i + 1)}
                    style={{ padding: '8px 16px', border: currentPage === i + 1 ? 'none' : '1px solid #eaeaea', backgroundColor: currentPage === i + 1 ? 'var(--primary)' : 'white', color: currentPage === i + 1 ? 'white' : 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => paginate(currentPage + 1)}
                  style={{ padding: '8px 16px', border: '1px solid #eaeaea', backgroundColor: 'white', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#ccc' : 'var(--text-primary)' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Stock Count</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Discount (%)</label>
                  <input type="number" min="0" max="100" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Sale End Date</label>
                  <input type="datetime-local" value={formData.discountEndDate} onChange={e => setFormData({...formData, discountEndDate: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', outline: 'none', backgroundColor: 'white' }}>
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Colors (comma separated)</label>
                  <input type="text" placeholder="e.g. Red, Blue, Black" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Sizes (comma separated)</label>
                  <input type="text" placeholder="e.g. S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Product Images (Up to 5)</label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {formData.images && formData.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img} alt={`Preview ${i}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eaeaea' }} />
                      <button type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>&times;</button>
                    </div>
                  ))}
                  {(!formData.images || formData.images.length === 0) && formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Legacy Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eaeaea' }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Or paste primary image URL..." style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', width: '100%' }} />
                    <input type="file" multiple accept="image/*" onChange={uploadFileHandler} style={{ fontSize: '14px' }} />
                  </div>
                </div>
                {uploading && <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>Uploading to Cloudinary...</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid #eaeaea', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '400px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
              <i className="lucide AlertTriangle" style={{ color: '#ef4444', fontSize: '24px' }}></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Delete Product</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={cancelDelete} style={{ padding: '10px 20px', border: '1px solid #eaeaea', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px', fontWeight: '500', flex: 1 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', borderRadius: '4px', fontWeight: '500', flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
