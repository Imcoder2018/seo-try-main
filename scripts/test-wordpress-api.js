#!/usr/bin/env node

/**
 * Test script for WordPress API integration
 * Run with: node scripts/test-wordpress-api.js
 */

const WORDPRESS_URL = process.env.WORDPRESS_URL || "https://your-wordpress-site.com";
const API_KEY = process.env.WORDPRESS_API_KEY || "";

async function testWordPressAPI() {
  console.log("🔍 Testing WordPress API Integration...\n");

  // Test 1: Verify connection
  console.log("1. Testing connection...");
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/seo-autofix/v1/verify`, {
      headers: {
        "X-SEO-AutoFix-Key": API_KEY,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Connection successful!");
      console.log(`   Site: ${data.name}`);
      console.log(`   Plugin Version: ${data.version}`);
      console.log(`   WordPress Version: ${data.wordpress}\n`);
    } else {
      console.log("❌ Connection failed");
      console.log(`   Status: ${response.status}`);
      const error = await response.json().catch(() => ({}));
      console.log(`   Error: ${error.message || 'Unknown error'}\n`);
      return;
    }
  } catch (error) {
    console.log("❌ Connection error:", error.message);
    console.log("   Check your WordPress URL and network connection\n");
    return;
  }

  // Test 2: Test content publishing
  console.log("2. Testing content publishing...");
  try {
    const testContent = {
      title: "Test Post from SEO AutoFix API",
      content: "<p>This is a test post published via the SEO AutoFix WordPress API integration.</p><p>If you can see this post, the integration is working correctly!</p>",
      location: "Test Location",
      contentType: "blog post",
      primaryKeywords: ["test", "api", "integration"],
      status: "draft",
    };

    const response = await fetch(`${WORDPRESS_URL}/wp-json/seo-autofix/v1/content/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SEO-AutoFix-Key": API_KEY,
      },
      body: JSON.stringify(testContent),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Content published successfully!");
      console.log(`   Post ID: ${data.post.id}`);
      console.log(`   Post Title: ${data.post.title.rendered}`);
      console.log(`   Status: ${data.post.status}`);
      console.log(`   Link: ${data.post.link}\n`);
    } else {
      console.log("❌ Publishing failed");
      console.log(`   Status: ${response.status}`);
      const error = await response.json().catch(() => ({}));
      console.log(`   Error: ${error.error || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log("❌ Publishing error:", error.message);
    console.log("   Check your API key and permissions\n");
  }

  // Test 3: Test content retrieval
  console.log("3. Testing content retrieval...");
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/seo-autofix/v1/content`, {
      headers: {
        "X-SEO-AutoFix-Key": API_KEY,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Content retrieved successfully!");
      console.log(`   Found ${data.posts.length} posts`);
      if (data.posts.length > 0) {
        console.log("   Recent posts:");
        data.posts.slice(0, 3).forEach((post, index) => {
          console.log(`     ${index + 1}. ${post.title.rendered} (${post.status})`);
        });
      }
      console.log("");
    } else {
      console.log("❌ Retrieval failed");
      console.log(`   Status: ${response.status}`);
      const error = await response.json().catch(() => ({}));
      console.log(`   Error: ${error.error || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log("❌ Retrieval error:", error.message);
    console.log("   Check your API key and permissions\n");
  }

  console.log("🎉 WordPress API test completed!");
  console.log("\nIf all tests passed, your WordPress integration is ready to use.");
  console.log("You can now publish content from the SEO AutoFix dashboard.");
}

// Check environment variables
if (!WORDPRESS_URL || WORDPRESS_URL === "https://your-wordpress-site.com") {
  console.log("❌ Please set WORDPRESS_URL in your .env file");
  process.exit(1);
}

if (!API_KEY) {
  console.log("❌ Please set WORDPRESS_API_KEY in your .env file");
  console.log("   Get the API key from: WordPress Dashboard → SEO AutoFix → Settings");
  process.exit(1);
}

// Run the test
testWordPressAPI().catch(console.error);
