// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Basic token validation - you can add more sophisticated validation here
  try {
    // Check if token exists and is not empty
    if (token && token.trim() !== '') {
      return true;
    }
  } catch (error) {
    console.error('Token validation error:', error);
  }
  
  return false;
};

// Validate token with backend
export const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:5001/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    } else {
      // Token is invalid, clear it
      clearAuth();
      return false;
    }
  } catch (error) {
    console.error('Token validation error:', error);
    // Network error, clear token to be safe
    clearAuth();
    return false;
  }
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  console.log('🧹 Authentication data cleared');
};

// Get user data
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Clear invalid user data
    localStorage.removeItem('user');
    return null;
  }
};

// Set authentication data
export const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  console.log('🔐 Authentication data set');
}; 