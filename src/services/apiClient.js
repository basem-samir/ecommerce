const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const apiClient = async (endpoint, options = {}) => {
  // Grab the user from local storage to get the token
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo ? userInfo.token : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If body is FormData, we don't set Content-Type so the browser can set it with the boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check for HTTP errors
    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Response might not be JSON
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Try parsing JSON, otherwise return null (for 204 No Content, etc.)
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      return null;
    }
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
};

export default apiClient;
