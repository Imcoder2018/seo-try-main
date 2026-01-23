// Quick fix for WordPress API key issue
console.log('🔧 Quick Fix for WordPress Connection');

// Step 1: Clear the bad connection
localStorage.removeItem('wp_connection_global');
console.log('✅ Cleared bad connection');

// Step 2: Get API key directly from WordPress
console.log('📝 Getting API key from WordPress...');

fetch('https://arialflow.com/wp-json/seo-autofix/v1/status', {
  headers: {
    'X-SEO-AutoFix-Key': 'test-key',
    'Authorization': 'Bearer test-key',
  }
})
.then(response => {
  if (response.status === 401) {
    console.log('❌ API requires authentication (expected)');
    console.log('\n🔑 MANUAL STEPS REQUIRED:');
    console.log('1. Open: https://arialflow.com/wp-admin');
    console.log('2. Go to: SEO AutoFix → API / Connect');
    console.log('3. Enable "Remote API"');
    console.log('4. Copy the API key shown');
    console.log('5. Run: fixConnection("PASTE_API_KEY_HERE")');
    
    // Add helper function
    window.fixConnection = function(apiKey) {
      const conn = {
        siteUrl: 'https://arialflow.com',
        apiKey: apiKey,
        connected: true,
        siteName: 'Arialflow'
      };
      
      localStorage.setItem('wp_connection_global', JSON.stringify(conn));
      console.log('✅ Connection fixed! Refresh the page.');
      
      // Test immediately
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
          console.log('🎉 SUCCESS! Auto-fix buttons will work now.');
        } else {
          console.log('❌ API key still invalid:', data.error);
        }
        return data;
      });
    };
    
    console.log('\n💡 Once you have the API key, run: fixConnection("YOUR_API_KEY")');
  }
})
.catch(error => {
  console.error('Error:', error);
});

// Alternative: Try to find API key in page source (long shot)
fetch('https://arialflow.com/wp-admin/admin.php?page=seo-auto-fix-api')
.then(response => response.text())
.then(html => {
  const apiKeyMatch = html.match(/API Key[^>]*>([a-zA-Z0-9]{32})</);
  if (apiKeyMatch) {
    console.log('🎉 Found API key in page source!');
    window.fixConnection(apiKeyMatch[1]);
  } else {
    console.log('❌ API key not found in page source (requires login)');
  }
})
.catch(() => {
  console.log('❌ Cannot access admin page without login');
});
