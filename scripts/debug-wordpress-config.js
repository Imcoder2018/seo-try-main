#!/usr/bin/env node

/**
 * Debug script to check WordPress configuration
 * Run with: node scripts/debug-wordpress-config.js
 */

console.log("🔍 WordPress Configuration Debug\n");

// Check environment variables
const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_API_KEY = process.env.WORDPRESS_API_KEY;

console.log("Environment Variables:");
console.log(`WORDPRESS_URL: ${WORDPRESS_URL || "❌ NOT SET"}`);
console.log(`WORDPRESS_API_KEY: ${WORDPRESS_API_KEY ? "✅ SET" : "❌ NOT SET"}`);

if (WORDPRESS_URL) {
  console.log(`\nURL Analysis:`);
  console.log(`- Protocol: ${WORDPRESS_URL.startsWith('https://') ? '✅ HTTPS' : '⚠️  HTTP'}`);
  console.log(`- Format: ${WORDPRESS_URL.includes('wp-json') ? '⚠️  Includes wp-json path' : '✅ Base URL'}`);
  console.log(`- Example: ${WORDPRESS_URL === 'https://your-wordpress-site.com' ? '❌ Default placeholder' : '✅ Custom URL'}`);
}

if (WORDPRESS_API_KEY) {
  console.log(`\nAPI Key Analysis:`);
  console.log(`- Length: ${WORDPRESS_API_KEY.length} characters`);
  console.log(`- Format: ${WORDPRESS_API_KEY.length === 32 ? '✅ 32 chars (expected)' : '⚠️  Unexpected length'}`);
} else {
  console.log(`\n❌ API Key Missing!`);
  console.log(`To get the API key:`);
  console.log(`1. Install SEO AutoFix plugin on your WordPress site`);
  console.log(`2. Go to WordPress Dashboard → SEO AutoFix → Settings`);
  console.log(`3. Enable "Remote API" option`);
  console.log(`4. Copy the API key from the settings page`);
}

console.log(`\n📋 Setup Checklist:`);
console.log(`${WORDPRESS_URL && WORDPRESS_URL !== 'https://your-wordpress-site.com' ? '✅' : '❌'} WORDPRESS_URL configured`);
console.log(`${WORDPRESS_API_KEY ? '✅' : '❌'} WORDPRESS_API_KEY configured`);
console.log(`${WORDPRESS_URL && WORDPRESS_API_KEY ? '✅' : '❌'} Ready to publish`);

if (!WORDPRESS_URL || !WORDPRESS_API_KEY || WORDPRESS_URL === 'https://your-wordpress-site.com') {
  console.log(`\n🔧 To fix:`);
  console.log(`1. Copy .env.example to .env`);
  console.log(`2. Add your WordPress configuration:`);
  console.log(`   WORDPRESS_URL="https://your-actual-wordpress-site.com"`);
  console.log(`   WORDPRESS_API_KEY="your-32-character-api-key"`);
  console.log(`3. Restart your Next.js application`);
}

console.log(`\n🧪 Test Commands:`);
console.log(`npm run test:wordpress     # Test WordPress connection`);
console.log(`npm run test:content-publishing  # Test full publishing flow`);
