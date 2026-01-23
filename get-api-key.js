// Script to get the API key directly from WordPress
const https = require('https');

async function getApiKey() {
  console.log('Attempting to get API key from WordPress...');
  
  // Since we can't access WordPress admin directly, let's try to generate a new API key
  // by calling the plugin's API endpoint directly
  
  const siteUrl = 'https://arialflow.com';
  
  // First, let's check if there's a way to get the API key through the API
  try {
    // Try to access the API page directly (might not work due to auth)
    const response = await fetch(`${siteUrl}/wp-json/seo-autofix/v1/status`, {
      headers: {
        'X-SEO-AutoFix-Key': 'test-key',
        'Authorization': 'Bearer test-key',
      },
    });
    
    if (response.status === 401) {
      console.log('❌ API requires authentication (expected)');
      console.log('💡 You need to:');
      console.log('   1. Go to WordPress admin: https://arialflow.com/wp-admin');
      console.log('   2. Navigate to SEO AutoFix → API / Connect');
      console.log('   3. Copy the API key from the page');
      console.log('   4. Use manual connection in the frontend');
    } else {
      const data = await response.json();
      console.log('Unexpected response:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n🔧 Manual Connection Instructions:');
  console.log('1. In WordPress admin, go to SEO AutoFix → API / Connect');
  console.log('2. Enable "Remote API"');
  console.log('3. Copy the API key shown on the page');
  console.log('4. In the SEO Audit Tool, use "Manual Setup" instead of "Auto Connect"');
  console.log('5. Enter your site URL and the API key');
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

getApiKey().catch(console.error);
