import apiClient from './apiClient';

export const getCategories = async () => {
  return await apiClient('/categories');
};

export const getCategoryById = async (id) => {
  return await apiClient(`/categories/${id}`);
};

export const createCategory = async (categoryData) => {
  return await apiClient('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (id, categoryData) => {
  return await apiClient(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  return await apiClient(`/categories/${id}`, {
    method: 'DELETE',
  });
};
