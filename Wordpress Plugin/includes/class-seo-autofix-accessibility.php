<?php
/**
 * Accessibility Features
 * 
 * Handles skip links, focus indicators, link warnings, and WCAG compliance
 */

defined('ABSPATH') || exit;

class SEO_AutoFix_Accessibility {
    
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
        
        // Accessibility features
        if (!empty($this->settings['enable_skip_link'])) {
            add_action('wp_body_open', array($this, 'output_skip_link'), 1);
        }
        
        if (!empty($this->settings['enable_focus_styles'])) {
            add_action('wp_head', array($this, 'output_focus_styles'), 99);
        }
        
        if (!empty($this->settings['add_link_warnings'])) {
            add_filter('the_content', array($this, 'add_external_link_warnings'));
            add_filter('nav_menu_link_attributes', array($this, 'add_menu_link_warnings'), 10, 4);
        }
        
        // Add landmark roles
        if (!empty($this->settings['enable_landmark_roles'])) {
            add_filter('the_content', array($this, 'add_landmark_roles'));
        }
    }
    
    public function register_endpoints() {
        $namespace = 'seo-autofix/v1';
        
        register_rest_route($namespace, '/fix/skip-link', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_skip_link'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/focus-styles', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_focus_styles'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/link-warnings', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_link_warnings'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/accessibility', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_all_accessibility'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
    }
    
    // ==================== API ENDPOINTS ====================
    
    public function api_fix_skip_link($request) {
        $enable = (bool) $request->get_param('enable');
        $text = sanitize_text_field($request->get_param('text') ?: 'Skip to main content');
        $target_id = sanitize_text_field($request->get_param('target_id') ?: 'main-content');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_skip_link'] = $enable;
        $settings['skip_link_text'] = $text;
        $settings['skip_link_target'] = $target_id;
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => $enable ? 'Skip link enabled' : 'Skip link disabled',
            'skip_link_text' => $text,
            'target_id' => $target_id,
        ), 200);
    }
    
    public function api_fix_focus_styles($request) {
        $enable = (bool) $request->get_param('enable');
        $outline_color = sanitize_hex_color($request->get_param('outline_color') ?: '#005fcc');
        $outline_width = sanitize_text_field($request->get_param('outline_width') ?: '3px');
        $outline_offset = sanitize_text_field($request->get_param('outline_offset') ?: '2px');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_focus_styles'] = $enable;
        $settings['focus_outline_color'] = $outline_color;
        $settings['focus_outline_width'] = $outline_width;
        $settings['focus_outline_offset'] = $outline_offset;
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => $enable ? 'Focus styles enabled' : 'Focus styles disabled',
            'outline_color' => $outline_color,
            'outline_width' => $outline_width,
        ), 200);
    }
    
    public function api_fix_link_warnings($request) {
        $add_aria_labels = (bool) $request->get_param('add_aria_labels');
        $add_visual_indicator = (bool) $request->get_param('add_visual_indicator');
        $indicator_text = sanitize_text_field($request->get_param('indicator_text') ?: '(opens in new tab)');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['add_link_warnings'] = $add_aria_labels || $add_visual_indicator;
        $settings['link_aria_labels'] = $add_aria_labels;
        $settings['link_visual_indicator'] = $add_visual_indicator;
        $settings['link_indicator_text'] = $indicator_text;
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Link warning settings updated',
            'aria_labels' => $add_aria_labels,
            'visual_indicator' => $add_visual_indicator,
        ), 200);
    }
    
    public function api_fix_all_accessibility($request) {
        $settings = get_option('seo_autofix_settings', array());
        
        // Enable all accessibility features with sensible defaults
        $settings['enable_skip_link'] = true;
        $settings['skip_link_text'] = 'Skip to main content';
        $settings['skip_link_target'] = 'main-content';
        
        $settings['enable_focus_styles'] = true;
        $settings['focus_outline_color'] = '#005fcc';
        $settings['focus_outline_width'] = '3px';
        $settings['focus_outline_offset'] = '2px';
        
        $settings['add_link_warnings'] = true;
        $settings['link_aria_labels'] = true;
        $settings['link_visual_indicator'] = true;
        $settings['link_indicator_text'] = '(opens in new tab)';
        
        $settings['enable_landmark_roles'] = true;
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'All accessibility features enabled',
            'features' => array(
                'skip_link' => true,
                'focus_styles' => true,
                'link_warnings' => true,
                'landmark_roles' => true,
            ),
        ), 200);
    }
    
    // ==================== FRONTEND OUTPUT ====================
    
    public function output_skip_link() {
        $text = $this->settings['skip_link_text'] ?? 'Skip to main content';
        $target = $this->settings['skip_link_target'] ?? 'main-content';
        
        echo '<a href="#' . esc_attr($target) . '" class="seo-autofix-skip-link">' . esc_html($text) . '</a>' . "\n";
        
        // Add inline styles for skip link
        echo '<style>
.seo-autofix-skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    z-index: 100000;
    text-decoration: none;
    font-weight: 600;
    border-radius: 0 0 4px 0;
    transition: top 0.3s;
}
.seo-autofix-skip-link:focus {
    top: 0;
    outline: 3px solid #005fcc;
    outline-offset: 2px;
}
</style>' . "\n";
    }
    
    public function output_focus_styles() {
        $color = $this->settings['focus_outline_color'] ?? '#005fcc';
        $width = $this->settings['focus_outline_width'] ?? '3px';
        $offset = $this->settings['focus_outline_offset'] ?? '2px';
        
        echo '<style id="seo-autofix-focus-styles">
/* Accessible Focus Indicators */
*:focus {
    outline: ' . esc_attr($width) . ' solid ' . esc_attr($color) . ' !important;
    outline-offset: ' . esc_attr($offset) . ' !important;
}
*:focus:not(:focus-visible) {
    outline: none !important;
}
*:focus-visible {
    outline: ' . esc_attr($width) . ' solid ' . esc_attr($color) . ' !important;
    outline-offset: ' . esc_attr($offset) . ' !important;
}
a:focus, button:focus, input:focus, select:focus, textarea:focus {
    outline: ' . esc_attr($width) . ' solid ' . esc_attr($color) . ' !important;
    outline-offset: ' . esc_attr($offset) . ' !important;
}
</style>' . "\n";
    }
    
    public function add_external_link_warnings($content) {
        if (empty($content)) {
            return $content;
        }
        
        $home_url = home_url();
        $add_aria = !empty($this->settings['link_aria_labels']);
        $add_visual = !empty($this->settings['link_visual_indicator']);
        $indicator_text = $this->settings['link_indicator_text'] ?? '(opens in new tab)';
        
        // Find all links with target="_blank"
        $pattern = '/<a\s+([^>]*target=["\']_blank["\'][^>]*)>/i';
        
        $content = preg_replace_callback($pattern, function($matches) use ($add_aria, $add_visual, $indicator_text, $home_url) {
            $tag = $matches[0];
            $attrs = $matches[1];
            
            // Skip if already has aria-label
            if (strpos($attrs, 'aria-label') !== false) {
                return $tag;
            }
            
            // Get existing link text for aria-label
            $modifications = '';
            
            if ($add_aria) {
                // Add aria-label
                $modifications .= ' aria-label="' . esc_attr($indicator_text) . '"';
            }
            
            // Add rel="noopener" if not present
            if (strpos($attrs, 'rel=') === false) {
                $modifications .= ' rel="noopener noreferrer"';
            }
            
            // Insert modifications before the closing >
            $new_tag = str_replace('>', $modifications . '>', $tag);
            
            return $new_tag;
        }, $content);
        
        // Add visual indicator after link text
        if ($add_visual) {
            $content = preg_replace_callback(
                '/<a\s+[^>]*target=["\']_blank["\'][^>]*>(.+?)<\/a>/is',
                function($matches) use ($indicator_text) {
                    $full_match = $matches[0];
                    $link_text = $matches[1];
                    
                    // Don't add if indicator already present
                    if (strpos($full_match, 'opens in new') !== false) {
                        return $full_match;
                    }
                    
                    // Add visual indicator
                    $icon = '<span class="seo-autofix-external-icon" aria-hidden="true"> ↗</span><span class="screen-reader-text"> ' . esc_html($indicator_text) . '</span>';
                    
                    return str_replace('</a>', $icon . '</a>', $full_match);
                },
                $content
            );
        }
        
        return $content;
    }
    
    public function add_menu_link_warnings($atts, $item, $args, $depth) {
        if (!empty($atts['target']) && $atts['target'] === '_blank') {
            $indicator_text = $this->settings['link_indicator_text'] ?? '(opens in new tab)';
            
            if (!empty($this->settings['link_aria_labels'])) {
                $existing_label = isset($atts['aria-label']) ? $atts['aria-label'] . ' ' : '';
                $atts['aria-label'] = $existing_label . $indicator_text;
            }
            
            // Ensure rel="noopener"
            $existing_rel = isset($atts['rel']) ? $atts['rel'] . ' ' : '';
            if (strpos($existing_rel, 'noopener') === false) {
                $atts['rel'] = trim($existing_rel . 'noopener noreferrer');
            }
        }
        
        return $atts;
    }
    
    public function add_landmark_roles($content) {
        // This is a basic implementation - themes should handle this properly
        // We add role attributes where appropriate
        
        // Add main role to content area
        if (strpos($content, 'role="main"') === false) {
            $content = '<div role="main" id="main-content">' . $content . '</div>';
        }
        
        return $content;
    }
}

// Initialize
SEO_AutoFix_Accessibility::instance();
