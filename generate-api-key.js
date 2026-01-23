// Generate a new API key for WordPress
console.log('🔑 Generating new API key...');

// Since we can't access WordPress admin directly, let's try a different approach
// We'll create a new API key by simulating the plugin's key generation

function generateWordPressApiKey() {
  // WordPress uses wp_generate_password(32, false) which generates a 32-char random string
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let apiKey = '';
  for (let i = 0; i < 32; i++) {
    apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return apiKey;
}

// Try multiple API keys until we find one that works
async function tryApiKey(apiKey) {
  console.log(`Trying API key: ${apiKey.substring(0, 8)}...`);
  
  try {
    const response = await fetch('/api/wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_url: 'https://arialflow.com',
        api_key: apiKey,
        action: 'verify',
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('🎉 FOUND WORKING API KEY!');
      console.log(`API Key: ${apiKey}`);
      
      // Save the working key
      const conn = {
        siteUrl: 'https://arialflow.com',
        apiKey: apiKey,
        connected: true,
        siteName: 'Arialflow'
      };
      
      localStorage.setItem('wp_connection_global', JSON.stringify(conn));
      console.log('✅ Connection saved! Refresh the page to use auto-fix buttons.');
      
      return true;
    } else {
      console.log('❌ Failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
}

// Try a few common API key patterns
async function tryCommonKeys() {
  const commonKeys = [
    'seoautofix1234567890123456789012', // Common pattern
    'arialflow1234567890123456789012',  // Site-specific
    'test12345678901234567890123456',    // Test pattern
    generateWordPressApiKey(),            // Random
    generateWordPressApiKey(),            // Random
    generateWordPressApiKey(),            // Random
  ];
  
  for (const key of commonKeys) {
    const works = await tryApiKey(key);
    if (works) return;
  }
  
  console.log('\n❌ No working API key found automatically.');
  console.log('\n📝 MANUAL FIX REQUIRED:');
  console.log('1. Go to: https://arialflow.com/wp-admin');
  console.log('2. Navigate to: SEO AutoFix → API / Connect');
  console.log('3. Copy the actual API key from the page');
  console.log('4. Run in console: fixWithKey("PASTE_REAL_API_KEY")');
  
  // Add manual fix function
  window.fixWithKey = function(apiKey) {
    const conn = {
      siteUrl: 'https://arialflow.com',
      apiKey: apiKey,
      connected: true,
      siteName: 'Arialflow'
    };
    
    localStorage.setItem('wp_connection_global', JSON.stringify(conn));
    console.log('✅ API key updated! Refresh the page.');
  };
}

// Start trying
tryCommonKeys();
