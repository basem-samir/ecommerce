import apiClient from './apiClient';

export const getProducts = async () => {
  return await apiClient('/products');
};

export const getProductById = async (id) => {
  return await apiClient(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return await apiClient('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return await apiClient(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return await apiClient(`/products/${id}`, {
    method: 'DELETE',
  });
};
