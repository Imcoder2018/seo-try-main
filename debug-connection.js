// Debug script to check WordPress connection
console.log('Checking WordPress connection...');

// Check localStorage
const wpConnection = localStorage.getItem('wp_connection_global') || localStorage.getItem('wp_connection_arialflow.com');
if (wpConnection) {
  const conn = JSON.parse(wpConnection);
  console.log('WordPress connection found:', conn);
  console.log('Site URL:', conn.siteUrl);
  console.log('API Key:', conn.apiKey ? conn.apiKey.substring(0, 8) + '...' : 'missing');
  console.log('Connected:', conn.connected);
  
  // Test the connection
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
    console.log('API verification result:', data);
  })
  .catch(error => {
    console.error('API verification error:', error);
  });
} else {
  console.log('No WordPress connection found in localStorage');
}

// Check what happens when we try to fix something
console.log('\nTesting fix endpoint...');
if (wpConnection) {
  const conn = JSON.parse(wpConnection);
  fetch('/api/wordpress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      site_url: conn.siteUrl,
      api_key: conn.apiKey,
      action: 'fix_local_seo',
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Fix test result:', data);
  })
  .catch(error => {
    console.error('Fix test error:', error);
  });
}
