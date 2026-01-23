// Fix the WordPress connection by getting the real API key
console.log('🔧 Fixing WordPress connection...');

// Check current connection
const currentConnection = localStorage.getItem('wp_connection_global');
if (currentConnection) {
  const conn = JSON.parse(currentConnection);
  console.log('Current connection:', {
    siteUrl: conn.siteUrl,
    apiKey: conn.apiKey ? conn.apiKey.substring(0, 8) + '...' : 'missing',
    connected: conn.connected
  });
  
  // Test if current API key works
  fetch('/api/wordpress', {
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
    console.log('Current API key test:', data);
    if (data.success) {
      console.log('✅ Current API key works!');
    } else {
      console.log('❌ Current API key failed, need to get real one');
      promptForApiKey();
    }
  })
  .catch(error => {
    console.error('Error testing current key:', error);
    promptForApiKey();
  });
} else {
  console.log('No connection found');
  promptForApiKey();
}

function promptForApiKey() {
  console.log('\n📝 To fix the connection:');
  console.log('1. Go to: https://arialflow.com/wp-admin');
  console.log('2. Navigate to: SEO AutoFix → API / Connect');
  console.log('3. Enable "Remote API"');
  console.log('4. Copy the API key');
  console.log('5. Run this command in browser console:');
  console.log('');
  console.log('fixWordPressConnection("YOUR_API_KEY_HERE");');
  console.log('');
  
  // Add helper function to global scope
  window.fixWordPressConnection = function(apiKey) {
    const conn = {
      siteUrl: 'https://arialflow.com',
      apiKey: apiKey,
      connected: true,
      siteName: 'Arialflow'
    };
    
    localStorage.setItem('wp_connection_global', JSON.stringify(conn));
    console.log('✅ Connection updated with new API key');
    
    // Test the new connection
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
      console.log('New API key test:', data);
      if (data.success) {
        console.log('🎉 Connection fixed! Refresh the page to use auto-fix buttons.');
      } else {
        console.log('❌ API key still invalid');
      }
      return data;
    });
  };
}
