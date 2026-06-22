import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Loader from '../components/Loader';

const AdminCategories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
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

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
      const data = await res.json();
      setCategories(data.reverse());
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        imageUrl: category.imageUrl || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        imageUrl: '',
      });
    }
    setShowModal(true);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataBody = new FormData();
    formDataBody.append('image', file);
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
        setFormData({ ...formData, imageUrl: data.url });
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
    setEditingCategory(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${editingCategory._id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchCategories();
        handleCloseModal();
        if (!editingCategory) {
          showToast('Category added successfully!');
          setCurrentPage(1); // Reset to first page
        } else {
          showToast('Category updated successfully!');
        }
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to delete category', error);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const filteredCategories = categories.filter(category => 
    (category.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="container mobile-stack" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '48px' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Category Management</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              style={{ padding: '8px 16px', border: '1px solid #eaeaea', borderRadius: '4px', width: '250px' }} 
            />
            <button onClick={() => handleOpenModal()} style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>+ Add Category</button>
          </div>
        </div>
        
        {loading ? (
          <Loader type="skeleton-table" />
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="table-responsive-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eaeaea' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>IMAGE</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>NAME</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map(category => (
                    <tr key={category._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eaeaea', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{fontSize:'10px', color:'#999'}}>No Img</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{category.name}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleOpenModal(category)} style={{ padding: '6px 12px', border: '1px solid #eaeaea', backgroundColor: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Edit</button>
                          <button onClick={() => handleDeleteClick(category._id)} style={{ padding: '6px 12px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Delete</button>
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

      {/* Category Form Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Category Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Category Image</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eaeaea' }} />
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Or paste image URL..." style={{ padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px', width: '100%' }} />
                    <input type="file" onChange={uploadFileHandler} style={{ fontSize: '14px' }} />
                  </div>
                </div>
                {uploading && <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>Uploading to Cloudinary...</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid #eaeaea', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>Save Category</button>
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
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Delete Category</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to delete this category? This action cannot be undone.
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

export default AdminCategories;
