// Browser console fix for WordPress API key
console.log('🔧 WordPress Connection Fix');

// Clear bad connection
localStorage.removeItem('wp_connection_global');
console.log('✅ Cleared bad connection');

// Add fix function
window.fixWordPressConnection = function(apiKey) {
  const conn = {
    siteUrl: 'https://arialflow.com',
    apiKey: apiKey,
    connected: true,
    siteName: 'Arialflow'
  };
  
  localStorage.setItem('wp_connection_global', JSON.stringify(conn));
  console.log('✅ Connection updated with API key:', apiKey.substring(0, 8) + '...');
  
  // Test the connection
  return fetch('/api/wordpress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      site_url: conn.siteUrl,
      api_key: conn.apiKey,
      action: 'verify',
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('🎉 SUCCESS! Auto-fix buttons will work now. Refresh the page!');
    } else {
      console.log('❌ API key invalid:', data.error);
    }
    return data;
  });
};

console.log('📝 To fix the connection:');
console.log('1. Go to: https://arialflow.com/wp-admin');
console.log('2. Navigate to: SEO AutoFix → API / Connect');
console.log('3. Copy the API key');
console.log('4. Run: fixWordPressConnection("PASTE_API_KEY_HERE")');
