// Clear authentication tokens - Run this in browser console
function clearAuthTokens() {
  console.log('🔧 Clearing authentication tokens...');
  
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Clear sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  
  console.log('✅ Authentication tokens cleared!');
  console.log('🔄 Refreshing page...');
  
  // Refresh the page
  window.location.reload();
}

// Check current authentication status
function checkAuthStatus() {
  console.log('🔍 Checking authentication status...');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token:', token ? 'Present' : 'None');
  console.log('User:', user ? JSON.parse(user) : 'None');
  
  if (token) {
    console.log('⚠️  Token found - this might be causing the redirect issue');
    console.log('💡 Run clearAuthTokens() to clear the token');
  } else {
    console.log('✅ No token found - authentication should work normally');
  }
}

// Quick fix - clear and reload
function quickFix() {
  clearAuthTokens();
}

console.log('🔧 ERP Authentication Debug Tools Loaded');
console.log('Available functions:');
console.log('- clearAuthTokens() - Clear all auth tokens and reload');
console.log('- checkAuthStatus() - Check current auth status');
console.log('- quickFix() - Quick fix (clear and reload)');

// Auto-check status
checkAuthStatus(); 