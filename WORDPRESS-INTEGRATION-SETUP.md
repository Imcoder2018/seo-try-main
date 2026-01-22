# WordPress Integration Setup Guide

This guide will help you set up the WordPress content publishing integration using the SEO AutoFix plugin.

## Prerequisites

- A WordPress site (self-hosted)
- Admin access to WordPress dashboard
- Your SEO AutoFix SaaS application running

## Step 1: Install the SEO AutoFix Plugin

1. Copy the plugin files from `C:\New-folder-4\Arman-SaaS\wordpress-plugin\wp\seo-auto-fix.php` to your WordPress site
2. Place it in `/wp-content/plugins/seo-auto-fix/`
3. Activate the plugin in your WordPress dashboard

## Step 2: Configure the Plugin

1. In your WordPress dashboard, go to **SEO AutoFix → Settings**
2. Enable the **Remote API** option
3. Copy the **API Key** displayed on the settings page

## Step 3: Configure Your SaaS Application

1. Copy the `.env.example` file to `.env` in your SaaS application
2. Add your WordPress configuration:

```env
# WordPress Integration
WORDPRESS_URL="https://your-wordpress-site.com"
WORDPRESS_API_KEY="your-api-key-from-step-2"
```

Replace:
- `https://your-wordpress-site.com` with your actual WordPress site URL
- `your-api-key-from-step-2` with the API key from the plugin settings

## Step 4: Test the Integration

1. Restart your SaaS application if it's running
2. Go to the content strategy page: `http://localhost:3000/content-strategy?view=auto-content`
3. Generate some content and try to publish it to WordPress
4. Check your WordPress dashboard to see the published content

## Features

The integration supports:

- **Content Publishing**: Publish generated content as drafts or published posts
- **Meta Data**: Automatically adds SEO meta descriptions
- **Featured Images**: Downloads and sets featured images from URLs
- **Content Classification**: Tags content with location, type, and keywords
- **Status Control**: Choose between draft, publish, or pending status

## API Endpoints

The plugin provides these REST API endpoints:

- `POST /wp-json/seo-autofix/v1/content/publish` - Publish new content
- `GET /wp-json/seo-autofix/v1/content` - Get published content
- `GET /wp-json/seo-autofix/v1/content?postId=123` - Get specific post

## Troubleshooting

### "Remote API is disabled" error
- Go to WordPress dashboard → SEO AutoFix → Settings
- Enable the "Enable remote API access" checkbox
- Save settings

### "Invalid API key" error
- Double-check the API key in your `.env` file matches the one in WordPress settings
- Ensure there are no extra spaces or characters

### "Failed to publish to WordPress" error
- Check that your WordPress URL is correct and accessible
- Verify your WordPress site has the SEO AutoFix plugin activated
- Check WordPress error logs for more details

## Security Notes

- The API key provides full access to publish content on your WordPress site
- Keep the API key secure and never commit it to version control
- Only enable the remote API on sites you trust
- Consider using HTTPS for your WordPress site

## Advanced Configuration

### Custom Post Types
The plugin currently publishes to the default 'post' post type. To use custom post types, modify the `post_type` parameter in the `seo_autofix_api_publish_content` function.

### Additional Meta Fields
You can extend the meta data stored with each post by adding more `update_post_meta` calls in the publishing function.

### Custom Statuses
Add support for custom post statuses by extending the status validation in the publishing function.
