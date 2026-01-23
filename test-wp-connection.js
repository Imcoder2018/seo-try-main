const https = require('https');

// Test function to check WordPress connection
async function testWordPressConnection() {
  const siteUrl = 'https://arialflow.com';
  
  console.log('Testing WordPress connection...');
  
  // 1. Test if plugin is active
  try {
    const pingResponse = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/ping`);
    const pingData = await pingResponse.json();
    console.log('✅ Plugin active:', pingData);
  } catch (error) {
    console.log('❌ Plugin not active:', error.message);
    return;
  }
  
  // 2. Try to get API key from WordPress admin (if we had access)
  // For now, let's test the handshake process
  
  console.log('\nTesting handshake initiation...');
  try {
    const handshakeResponse = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/handshake/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        saas_url: 'http://localhost:3000',
        callback_url: 'http://localhost:3000/api/wordpress/callback',
        nonce: 'test-nonce-' + Date.now(),
      }),
    });
    
    const handshakeData = await handshakeResponse.json();
    console.log('Handshake response:', handshakeData);
    
    if (handshakeData.success && handshakeData.approval_url) {
      console.log('✅ Handshake initiated');
      console.log('📝 Approval URL:', handshakeData.approval_url);
      console.log('🔑 Token:', handshakeData.token);
    } else {
      console.log('❌ Handshake failed:', handshakeData);
    }
  } catch (error) {
    console.log('❌ Handshake error:', error.message);
  }
}

// Helper function for Node.js fetch
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      };

      if (options.body) {
        requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
      }

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = data ? JSON.parse(data) : {};
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: () => Promise.resolve(jsonData),
              text: () => Promise.resolve(data),
            });
          } catch (e) {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: () => Promise.reject(e),
              text: () => Promise.resolve(data),
            });
          }
        });
      });

      req.on('error', reject);

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  };
}

testWordPressConnection().catch(console.error);
