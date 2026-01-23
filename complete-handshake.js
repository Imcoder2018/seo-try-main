const https = require('https');

// Complete handshake after approval
async function completeHandshake() {
  const siteUrl = 'https://arialflow.com';
  const token = 'lrLF8TqcVHskAw2F4zznZGm3gNs5g5fa'; // From previous handshake
  
  console.log('Completing handshake...');
  
  try {
    const response = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/handshake/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        connect_token: token,
      }),
    });
    
    const data = await response.json();
    console.log('Handshake completion response:', data);
    
    if (data.success && data.api_key) {
      console.log('✅ API Key obtained:', data.api_key);
      console.log('🔗 Site URL:', data.site_url);
      console.log('📝 Site Name:', data.site_name);
      
      // Test the API key
      console.log('\nTesting API key...');
      const testResponse = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/verify`, {
        headers: {
          'X-SEO-AutoFix-Key': data.api_key,
          'Authorization': `Bearer ${data.api_key}`,
        },
      });
      
      const testData = await testResponse.json();
      console.log('API verification:', testData);
    } else {
      console.log('❌ Handshake completion failed:', data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
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

completeHandshake().catch(console.error);
