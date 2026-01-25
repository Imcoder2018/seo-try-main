<?php
/**
 * Performance Optimization Features
 * 
 * Handles resource hints, JS/CSS optimization, preloading
 */

defined('ABSPATH') || exit;

class SEO_AutoFix_Performance {
    
    private static $instance = null;
    private $settings;
    
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function __construct() {
        $this->settings = get_option('seo_autofix_settings', array());
        
        add_action('rest_api_init', array($this, 'register_endpoints'));
        
        // Performance optimizations
        if (!empty($this->settings['enable_resource_hints'])) {
            add_action('wp_head', array($this, 'output_resource_hints'), 1);
        }
        
        if (!empty($this->settings['defer_js'])) {
            add_filter('script_loader_tag', array($this, 'defer_scripts'), 10, 3);
        }
        
        if (!empty($this->settings['remove_jquery_migrate'])) {
            add_action('wp_default_scripts', array($this, 'remove_jquery_migrate'));
        }
        
        if (!empty($this->settings['inline_critical_css'])) {
            add_action('wp_head', array($this, 'output_critical_css'), 2);
        }
        
        if (!empty($this->settings['defer_css'])) {
            add_filter('style_loader_tag', array($this, 'defer_stylesheets'), 10, 4);
        }
    }
    
    public function register_endpoints() {
        $namespace = 'seo-autofix/v1';
        
        register_rest_route($namespace, '/fix/resource-hints', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_resource_hints'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/js-optimization', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_js_optimization'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/css-optimization', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_css_optimization'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/preload', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_preload'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
    }
    
    // ==================== API ENDPOINTS ====================
    
    public function api_fix_resource_hints($request) {
        $preconnect = $request->get_param('preconnect');
        $dns_prefetch = $request->get_param('dns_prefetch');
        $preload = $request->get_param('preload');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_resource_hints'] = true;
        
        if (is_array($preconnect)) {
            $settings['preconnect_domains'] = array_map('esc_url_raw', $preconnect);
        }
        
        if (is_array($dns_prefetch)) {
            $settings['dns_prefetch_domains'] = array_map('esc_url_raw', $dns_prefetch);
        }
        
        if (is_array($preload)) {
            $settings['preload_resources'] = array();
            foreach ($preload as $resource) {
                if (is_array($resource) && !empty($resource['url'])) {
                    $settings['preload_resources'][] = array(
                        'url' => esc_url_raw($resource['url']),
                        'as' => sanitize_text_field($resource['as'] ?? 'fetch'),
                        'type' => sanitize_text_field($resource['type'] ?? ''),
                        'crossorigin' => !empty($resource['crossorigin']),
                    );
                }
            }
        }
        
        // Auto-detect common domains to preconnect
        if (empty($settings['preconnect_domains'])) {
            $settings['preconnect_domains'] = $this->detect_external_domains();
        }
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Resource hints configured',
            'preconnect' => $settings['preconnect_domains'] ?? array(),
            'dns_prefetch' => $settings['dns_prefetch_domains'] ?? array(),
            'preload' => $settings['preload_resources'] ?? array(),
        ), 200);
    }
    
    public function api_fix_js_optimization($request) {
        $defer_scripts = (bool) $request->get_param('defer_scripts');
        $async_analytics = (bool) $request->get_param('async_analytics');
        $remove_jquery_migrate = (bool) $request->get_param('remove_jquery_migrate');
        $inline_critical = (bool) $request->get_param('inline_critical');
        $exclude_scripts = $request->get_param('exclude_scripts');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['defer_js'] = $defer_scripts;
        $settings['async_analytics'] = $async_analytics;
        $settings['remove_jquery_migrate'] = $remove_jquery_migrate;
        $settings['inline_critical_js'] = $inline_critical;
        
        if (is_array($exclude_scripts)) {
            $settings['defer_exclude'] = array_map('sanitize_text_field', $exclude_scripts);
        } else {
            // Default exclusions
            $settings['defer_exclude'] = array('jquery', 'jquery-core');
        }
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'JavaScript optimization configured',
            'defer_scripts' => $defer_scripts,
            'async_analytics' => $async_analytics,
            'remove_jquery_migrate' => $remove_jquery_migrate,
        ), 200);
    }
    
    public function api_fix_css_optimization($request) {
        $inline_critical = (bool) $request->get_param('inline_critical');
        $defer_non_critical = (bool) $request->get_param('defer_non_critical');
        $critical_css = $request->get_param('critical_css');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['inline_critical_css'] = $inline_critical;
        $settings['defer_css'] = $defer_non_critical;
        
        if ($critical_css) {
            $settings['critical_css'] = wp_strip_all_tags($critical_css);
        }
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'CSS optimization configured',
            'inline_critical' => $inline_critical,
            'defer_non_critical' => $defer_non_critical,
        ), 200);
    }
    
    public function api_fix_preload($request) {
        $lcp_image = esc_url_raw($request->get_param('lcp_image') ?: '');
        $fonts = $request->get_param('fonts');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_resource_hints'] = true;
        
        $preload = $settings['preload_resources'] ?? array();
        
        // Add LCP image
        if ($lcp_image) {
            $preload[] = array(
                'url' => $lcp_image,
                'as' => 'image',
                'type' => '',
                'crossorigin' => false,
            );
            $settings['lcp_image'] = $lcp_image;
        }
        
        // Add fonts
        if (is_array($fonts)) {
            foreach ($fonts as $font) {
                $preload[] = array(
                    'url' => esc_url_raw($font),
                    'as' => 'font',
                    'type' => 'font/woff2',
                    'crossorigin' => true,
                );
            }
        }
        
        $settings['preload_resources'] = $preload;
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Preload resources configured',
            'lcp_image' => $lcp_image,
            'preload_count' => count($preload),
        ), 200);
    }
    
    // ==================== FRONTEND HOOKS ====================
    
    public function output_resource_hints() {
        $output = '';
        
        // DNS Prefetch
        $dns_prefetch = $this->settings['dns_prefetch_domains'] ?? array();
        foreach ($dns_prefetch as $domain) {
            $output .= '<link rel="dns-prefetch" href="' . esc_url($domain) . '">' . "\n";
        }
        
        // Preconnect
        $preconnect = $this->settings['preconnect_domains'] ?? array();
        foreach ($preconnect as $domain) {
            $output .= '<link rel="preconnect" href="' . esc_url($domain) . '" crossorigin>' . "\n";
        }
        
        // Preload
        $preload = $this->settings['preload_resources'] ?? array();
        foreach ($preload as $resource) {
            $tag = '<link rel="preload" href="' . esc_url($resource['url']) . '"';
            $tag .= ' as="' . esc_attr($resource['as']) . '"';
            
            if (!empty($resource['type'])) {
                $tag .= ' type="' . esc_attr($resource['type']) . '"';
            }
            
            if (!empty($resource['crossorigin'])) {
                $tag .= ' crossorigin';
            }
            
            $tag .= '>' . "\n";
            $output .= $tag;
        }
        
        echo $output;
    }
    
    public function defer_scripts($tag, $handle, $src) {
        // Don't defer admin scripts
        if (is_admin()) {
            return $tag;
        }
        
        // Exclusion list
        $exclude = $this->settings['defer_exclude'] ?? array('jquery', 'jquery-core');
        
        if (in_array($handle, $exclude)) {
            return $tag;
        }
        
        // Don't double-defer
        if (strpos($tag, 'defer') !== false || strpos($tag, 'async') !== false) {
            return $tag;
        }
        
        // Analytics - async instead of defer
        $analytics_handles = array('google-analytics', 'gtag', 'ga', 'gtm');
        if (!empty($this->settings['async_analytics']) && in_array($handle, $analytics_handles)) {
            return str_replace(' src=', ' async src=', $tag);
        }
        
        // Defer everything else
        return str_replace(' src=', ' defer src=', $tag);
    }
    
    public function remove_jquery_migrate($scripts) {
        if (!is_admin() && isset($scripts->registered['jquery'])) {
            $script = $scripts->registered['jquery'];
            if ($script->deps) {
                $script->deps = array_diff($script->deps, array('jquery-migrate'));
            }
        }
    }
    
    public function output_critical_css() {
        $critical_css = $this->settings['critical_css'] ?? '';
        
        if (empty($critical_css)) {
            // Default critical CSS
            $critical_css = $this->get_default_critical_css();
        }
        
        if ($critical_css) {
            echo '<style id="seo-autofix-critical-css">' . $critical_css . '</style>' . "\n";
        }
    }
    
    public function defer_stylesheets($tag, $handle, $href, $media) {
        // Don't defer admin styles
        if (is_admin()) {
            return $tag;
        }
        
        // Don't defer critical styles
        $critical_handles = array('wp-block-library', 'global-styles');
        if (in_array($handle, $critical_handles)) {
            return $tag;
        }
        
        // Convert to preload with onload
        $preload_tag = str_replace(
            "rel='stylesheet'",
            "rel='preload' as='style' onload=\"this.onload=null;this.rel='stylesheet'\"",
            $tag
        );
        
        // Add noscript fallback
        $noscript = '<noscript>' . $tag . '</noscript>';
        
        return $preload_tag . $noscript;
    }
    
    // ==================== HELPERS ====================
    
    private function detect_external_domains() {
        $domains = array();
        
        // Common third-party domains
        $common = array(
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
        );
        
        // Check if site uses these
        $home = home_url();
        
        foreach ($common as $domain) {
            // Basic detection - could be improved
            $domains[] = $domain;
        }
        
        return array_slice($domains, 0, 5); // Limit to 5
    }
    
    private function get_default_critical_css() {
        return '
/* Critical above-the-fold CSS */
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;line-height:1.5}
body{margin:0;font-family:system-ui,-apple-system,sans-serif}
img,video{max-width:100%;height:auto}
h1,h2,h3,h4,h5,h6{margin-top:0}
p{margin-top:0}
a{color:inherit;text-decoration:none}
.screen-reader-text{clip:rect(1px,1px,1px,1px);position:absolute!important;height:1px;width:1px;overflow:hidden}
';
    }
}

// Initialize
SEO_AutoFix_Performance::instance();
