<?php
/**
 * Advanced Features
 * 
 * Handles analytics, FAQ schema, llms.txt, and other advanced features
 */

defined('ABSPATH') || exit;

class SEO_AutoFix_Advanced {
    
    private static $instance = null;
    private $settings;
    private $audit_api_url;
    
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function __construct() {
        $this->settings = get_option('seo_autofix_settings', array());
        $this->audit_api_url = defined('SEO_AUDIT_API_URL') ? SEO_AUDIT_API_URL : 'https://seo-audit-tool.vercel.app';
        
        add_action('rest_api_init', array($this, 'register_endpoints'));
        add_action('init', array($this, 'register_shortcodes'));
        
        // Analytics injection
        if (!empty($this->settings['ga4_id']) || !empty($this->settings['gtm_id'])) {
            add_action('wp_head', array($this, 'output_analytics_head'), 1);
            add_action('wp_body_open', array($this, 'output_analytics_body'), 1);
        }
        
        // llms.txt route
        add_action('init', array($this, 'register_llms_txt_route'));
        
        // FAQ schema output
        add_action('wp_footer', array($this, 'output_faq_schema'));
    }
    
    public function register_endpoints() {
        $namespace = 'seo-autofix/v1';
        
        register_rest_route($namespace, '/fix/analytics', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_analytics'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/faq-schema', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_faq_schema'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/llms-txt', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_llms_txt'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/breadcrumbs', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_breadcrumbs'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        // AI-powered endpoints
        register_rest_route($namespace, '/ai/generate-content', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_ai_generate_content'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/ai/generate-faq', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_ai_generate_faq'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
    }
    
    public function register_shortcodes() {
        add_shortcode('seo_autofix_faq', array($this, 'shortcode_faq'));
        add_shortcode('faq_item', array($this, 'shortcode_faq_item'));
        add_shortcode('seo_autofix_breadcrumbs', array($this, 'shortcode_breadcrumbs'));
    }
    
    // ==================== API ENDPOINTS ====================
    
    public function api_fix_analytics($request) {
        $ga4_id = sanitize_text_field($request->get_param('google_analytics_id') ?: '');
        $gtm_id = sanitize_text_field($request->get_param('gtm_id') ?: '');
        $fb_pixel = sanitize_text_field($request->get_param('facebook_pixel') ?: '');
        $location = sanitize_text_field($request->get_param('location') ?: 'head');
        
        $settings = get_option('seo_autofix_settings', array());
        
        if ($ga4_id) {
            $settings['ga4_id'] = $ga4_id;
        }
        if ($gtm_id) {
            $settings['gtm_id'] = $gtm_id;
        }
        if ($fb_pixel) {
            $settings['fb_pixel_id'] = $fb_pixel;
        }
        $settings['analytics_location'] = $location;
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Analytics tracking configured',
            'ga4_id' => $settings['ga4_id'] ?? '',
            'gtm_id' => $settings['gtm_id'] ?? '',
            'fb_pixel_id' => $settings['fb_pixel_id'] ?? '',
        ), 200);
    }
    
    public function api_fix_faq_schema($request) {
        $faqs = $request->get_param('faqs');
        $page_id = intval($request->get_param('page_id') ?: 0);
        $add_to_page = (bool) $request->get_param('add_to_page');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_faq_schema'] = true;
        
        if (is_array($faqs)) {
            $clean_faqs = array();
            foreach ($faqs as $faq) {
                if (!empty($faq['question']) && !empty($faq['answer'])) {
                    $clean_faqs[] = array(
                        'question' => sanitize_text_field($faq['question']),
                        'answer' => wp_kses_post($faq['answer']),
                    );
                }
            }
            
            if ($page_id && $add_to_page) {
                // Store FAQs for specific page
                update_post_meta($page_id, '_seo_autofix_faqs', $clean_faqs);
                
                // Optionally append FAQ shortcode to page content
                $post = get_post($page_id);
                if ($post && strpos($post->post_content, '[seo_autofix_faq]') === false) {
                    $faq_content = $this->generate_faq_content($clean_faqs);
                    wp_update_post(array(
                        'ID' => $page_id,
                        'post_content' => $post->post_content . "\n\n" . $faq_content,
                    ));
                }
            } else {
                // Store as global FAQs
                $settings['global_faqs'] = $clean_faqs;
            }
        }
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'FAQ schema configured',
            'faq_count' => count($clean_faqs ?? array()),
            'page_id' => $page_id,
            'shortcode' => '[seo_autofix_faq]',
        ), 200);
    }
    
    public function api_fix_llms_txt($request) {
        $generate = (bool) $request->get_param('generate');
        $business_summary = sanitize_textarea_field($request->get_param('business_summary') ?: '');
        $key_services = $request->get_param('key_services');
        $custom_content = $request->get_param('custom_content');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_llms_txt'] = true;
        
        if ($business_summary) {
            $settings['llms_txt_summary'] = $business_summary;
        }
        
        if (is_array($key_services)) {
            $settings['llms_txt_services'] = array_map('sanitize_text_field', $key_services);
        }
        
        update_option('seo_autofix_settings', $settings);
        
        // Generate llms.txt content
        if ($generate || $custom_content) {
            $content = $custom_content ?: $this->generate_llms_txt_content();
            
            // Save to file
            $file_path = ABSPATH . 'llms.txt';
            file_put_contents($file_path, $content);
            
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'llms.txt generated',
                'url' => home_url('/llms.txt'),
                'content_length' => strlen($content),
            ), 200);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'llms.txt settings saved',
        ), 200);
    }
    
    public function api_fix_breadcrumbs($request) {
        $enable = (bool) $request->get_param('enable');
        $show_home = (bool) $request->get_param('show_home');
        $home_text = sanitize_text_field($request->get_param('home_text') ?: 'Home');
        $separator = sanitize_text_field($request->get_param('separator') ?: '›');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_breadcrumbs'] = $enable;
        $settings['breadcrumb_show_home'] = $show_home;
        $settings['breadcrumb_home_text'] = $home_text;
        $settings['breadcrumb_separator'] = $separator;
        $settings['enable_breadcrumb_schema'] = true;
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => $enable ? 'Breadcrumbs enabled' : 'Breadcrumbs disabled',
            'shortcode' => '[seo_autofix_breadcrumbs]',
        ), 200);
    }
    
    public function api_ai_generate_content($request) {
        $type = sanitize_text_field($request->get_param('type') ?: 'meta_description');
        $context = $request->get_param('context');
        
        // Call the main website's AI API
        $response = $this->call_ai_api($type, $context);
        
        if (is_wp_error($response)) {
            return new WP_REST_Response(array(
                'success' => false,
                'error' => $response->get_error_message(),
            ), 500);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'content' => $response,
        ), 200);
    }
    
    public function api_ai_generate_faq($request) {
        $business_type = sanitize_text_field($request->get_param('business_type') ?: '');
        $services = $request->get_param('services');
        $location = sanitize_text_field($request->get_param('location') ?: '');
        $count = min(10, max(1, intval($request->get_param('count') ?: 5)));
        
        // Call AI API to generate FAQs
        $response = $this->call_ai_api('generate_faq', array(
            'businessType' => $business_type ?: ($this->settings['business_type'] ?? 'Local Business'),
            'services' => $services ?: ($this->settings['llms_txt_services'] ?? array()),
            'location' => $location ?: ($this->settings['business_city'] ?? ''),
            'count' => $count,
        ));
        
        if (is_wp_error($response)) {
            return new WP_REST_Response(array(
                'success' => false,
                'error' => $response->get_error_message(),
            ), 500);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'faqs' => $response['faqs'] ?? array(),
        ), 200);
    }
    
    // ==================== SHORTCODES ====================
    
    public function shortcode_faq($atts, $content = null) {
        $atts = shortcode_atts(array(
            'class' => '',
            'schema' => 'true',
        ), $atts);
        
        // Get FAQs from content (nested shortcodes) or from stored data
        $faqs = array();
        
        if ($content) {
            // Parse nested [faq_item] shortcodes
            preg_match_all('/\[faq_item\s+question=["\']([^"\']+)["\']\](.+?)\[\/faq_item\]/s', $content, $matches, PREG_SET_ORDER);
            foreach ($matches as $match) {
                $faqs[] = array(
                    'question' => $match[1],
                    'answer' => trim($match[2]),
                );
            }
        }
        
        // If no nested content, try to get from post meta or global settings
        if (empty($faqs)) {
            $post_id = get_the_ID();
            $faqs = get_post_meta($post_id, '_seo_autofix_faqs', true);
            
            if (empty($faqs)) {
                $faqs = $this->settings['global_faqs'] ?? array();
            }
        }
        
        if (empty($faqs)) {
            return '';
        }
        
        $class = 'seo-autofix-faq ' . esc_attr($atts['class']);
        
        $output = '<div class="' . $class . '">';
        
        foreach ($faqs as $index => $faq) {
            $output .= '<div class="seo-autofix-faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">';
            $output .= '<h3 class="seo-autofix-faq-question" itemprop="name">' . esc_html($faq['question']) . '</h3>';
            $output .= '<div class="seo-autofix-faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">';
            $output .= '<div itemprop="text">' . wp_kses_post($faq['answer']) . '</div>';
            $output .= '</div></div>';
        }
        
        $output .= '</div>';
        
        // Add FAQ schema
        if ($atts['schema'] === 'true') {
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => array(),
            );
            
            foreach ($faqs as $faq) {
                $schema['mainEntity'][] = array(
                    '@type' => 'Question',
                    'name' => $faq['question'],
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text' => strip_tags($faq['answer']),
                    ),
                );
            }
            
            $output .= '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';
        }
        
        return $output;
    }
    
    public function shortcode_faq_item($atts, $content = null) {
        // This is used within [seo_autofix_faq] - returns empty as parent handles it
        return '';
    }
    
    public function shortcode_breadcrumbs($atts) {
        $atts = shortcode_atts(array(
            'class' => '',
            'schema' => 'true',
        ), $atts);
        
        $breadcrumbs = $this->get_breadcrumbs();
        
        if (empty($breadcrumbs)) {
            return '';
        }
        
        $separator = $this->settings['breadcrumb_separator'] ?? '›';
        $class = 'seo-autofix-breadcrumbs ' . esc_attr($atts['class']);
        
        $output = '<nav class="' . $class . '" aria-label="Breadcrumb">';
        $output .= '<ol itemscope itemtype="https://schema.org/BreadcrumbList">';
        
        $count = count($breadcrumbs);
        foreach ($breadcrumbs as $index => $crumb) {
            $position = $index + 1;
            $is_last = ($index === $count - 1);
            
            $output .= '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
            
            if ($is_last) {
                $output .= '<span itemprop="name">' . esc_html($crumb['title']) . '</span>';
            } else {
                $output .= '<a href="' . esc_url($crumb['url']) . '" itemprop="item">';
                $output .= '<span itemprop="name">' . esc_html($crumb['title']) . '</span>';
                $output .= '</a>';
                $output .= '<span class="seo-autofix-breadcrumb-separator" aria-hidden="true"> ' . esc_html($separator) . ' </span>';
            }
            
            $output .= '<meta itemprop="position" content="' . $position . '">';
            $output .= '</li>';
        }
        
        $output .= '</ol></nav>';
        
        return $output;
    }
    
    // ==================== FRONTEND OUTPUT ====================
    
    public function output_analytics_head() {
        // Google Analytics 4
        if (!empty($this->settings['ga4_id'])) {
            $ga4_id = esc_attr($this->settings['ga4_id']);
            echo "<!-- Google Analytics 4 -->
<script async src=\"https://www.googletagmanager.com/gtag/js?id={$ga4_id}\"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{$ga4_id}');
</script>\n";
        }
        
        // Google Tag Manager (head part)
        if (!empty($this->settings['gtm_id'])) {
            $gtm_id = esc_attr($this->settings['gtm_id']);
            echo "<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{$gtm_id}');</script>
<!-- End Google Tag Manager -->\n";
        }
        
        // Facebook Pixel
        if (!empty($this->settings['fb_pixel_id'])) {
            $fb_id = esc_attr($this->settings['fb_pixel_id']);
            echo "<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{$fb_id}');
fbq('track', 'PageView');
</script>
<noscript><img height=\"1\" width=\"1\" style=\"display:none\"
src=\"https://www.facebook.com/tr?id={$fb_id}&ev=PageView&noscript=1\"/></noscript>
<!-- End Facebook Pixel -->\n";
        }
    }
    
    public function output_analytics_body() {
        // Google Tag Manager (noscript part)
        if (!empty($this->settings['gtm_id'])) {
            $gtm_id = esc_attr($this->settings['gtm_id']);
            echo "<!-- Google Tag Manager (noscript) -->
<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id={$gtm_id}\"
height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->\n";
        }
    }
    
    public function output_faq_schema() {
        if (empty($this->settings['enable_faq_schema'])) {
            return;
        }
        
        // Only output if there are page-specific FAQs
        $post_id = get_the_ID();
        if (!$post_id) {
            return;
        }
        
        $faqs = get_post_meta($post_id, '_seo_autofix_faqs', true);
        if (empty($faqs)) {
            return;
        }
        
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => array(),
        );
        
        foreach ($faqs as $faq) {
            $schema['mainEntity'][] = array(
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => strip_tags($faq['answer']),
                ),
            );
        }
        
        echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }
    
    public function register_llms_txt_route() {
        if (empty($this->settings['enable_llms_txt'])) {
            return;
        }
        
        add_rewrite_rule('^llms\.txt$', 'index.php?seo_autofix_llms_txt=1', 'top');
        add_filter('query_vars', function($vars) {
            $vars[] = 'seo_autofix_llms_txt';
            return $vars;
        });
        
        add_action('template_redirect', function() {
            if (get_query_var('seo_autofix_llms_txt')) {
                header('Content-Type: text/plain; charset=utf-8');
                
                // Check for file first
                $file_path = ABSPATH . 'llms.txt';
                if (file_exists($file_path)) {
                    echo file_get_contents($file_path);
                } else {
                    echo $this->generate_llms_txt_content();
                }
                exit;
            }
        });
    }
    
    // ==================== HELPERS ====================
    
    private function generate_llms_txt_content() {
        $business_name = $this->settings['business_name'] ?? get_bloginfo('name');
        $business_type = $this->settings['business_type'] ?? 'Local Business';
        $summary = $this->settings['llms_txt_summary'] ?? '';
        $services = $this->settings['llms_txt_services'] ?? array();
        $city = $this->settings['business_city'] ?? '';
        $phone = $this->settings['business_phone'] ?? '';
        $email = $this->settings['business_email'] ?? '';
        
        $content = "# {$business_name}\n\n";
        $content .= "> {$business_type}";
        if ($city) {
            $content .= " serving {$city} and surrounding areas";
        }
        $content .= "\n\n";
        
        $content .= "## About\n";
        if ($summary) {
            $content .= "{$summary}\n\n";
        } else {
            $content .= "{$business_name} is a trusted {$business_type} committed to providing excellent service to our customers.\n\n";
        }
        
        if (!empty($services)) {
            $content .= "## Services\n";
            foreach ($services as $service) {
                $content .= "- {$service}\n";
            }
            $content .= "\n";
        }
        
        $content .= "## Contact\n";
        if ($phone) $content .= "- Phone: {$phone}\n";
        if ($email) $content .= "- Email: {$email}\n";
        $content .= "- Website: " . home_url() . "\n";
        if ($city) $content .= "- Location: {$city}\n";
        
        $content .= "\n## AI Instructions\n";
        $content .= "When asked about {$business_name}, provide accurate information based on this file.\n";
        $content .= "For specific inquiries about services, pricing, or availability, direct users to contact the business directly.\n";
        
        return $content;
    }
    
    private function generate_faq_content($faqs) {
        $content = "\n\n<!-- FAQ Section -->\n";
        $content .= "<h2>Frequently Asked Questions</h2>\n";
        $content .= "[seo_autofix_faq]\n";
        
        foreach ($faqs as $faq) {
            $content .= '[faq_item question="' . esc_attr($faq['question']) . '"]';
            $content .= $faq['answer'];
            $content .= "[/faq_item]\n";
        }
        
        $content .= "[/seo_autofix_faq]\n";
        
        return $content;
    }
    
    private function get_breadcrumbs() {
        $breadcrumbs = array();
        
        // Home
        if (!empty($this->settings['breadcrumb_show_home'])) {
            $breadcrumbs[] = array(
                'title' => $this->settings['breadcrumb_home_text'] ?? 'Home',
                'url' => home_url('/'),
            );
        }
        
        if (is_singular()) {
            $post = get_queried_object();
            
            // Add category for posts
            if (is_single() && $post->post_type === 'post') {
                $categories = get_the_category($post->ID);
                if (!empty($categories)) {
                    $cat = $categories[0];
                    $breadcrumbs[] = array(
                        'title' => $cat->name,
                        'url' => get_category_link($cat->term_id),
                    );
                }
            }
            
            // Add parent pages
            if (is_page() && $post->post_parent) {
                $parents = array();
                $parent_id = $post->post_parent;
                
                while ($parent_id) {
                    $parent = get_post($parent_id);
                    $parents[] = array(
                        'title' => $parent->post_title,
                        'url' => get_permalink($parent->ID),
                    );
                    $parent_id = $parent->post_parent;
                }
                
                $breadcrumbs = array_merge($breadcrumbs, array_reverse($parents));
            }
            
            // Current page
            $breadcrumbs[] = array(
                'title' => $post->post_title,
                'url' => get_permalink($post->ID),
            );
        } elseif (is_category()) {
            $cat = get_queried_object();
            $breadcrumbs[] = array(
                'title' => $cat->name,
                'url' => get_category_link($cat->term_id),
            );
        } elseif (is_search()) {
            $breadcrumbs[] = array(
                'title' => 'Search Results',
                'url' => get_search_link(),
            );
        } elseif (is_404()) {
            $breadcrumbs[] = array(
                'title' => 'Page Not Found',
                'url' => '',
            );
        }
        
        return $breadcrumbs;
    }
    
    private function call_ai_api($action, $data) {
        $api_url = $this->audit_api_url . '/api/plugin';
        
        $response = wp_remote_post($api_url, array(
            'timeout' => 60,
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'action' => 'ai_' . $action,
                'siteUrl' => home_url(),
                'apiKey' => get_option('seo_autofix_api_key'),
                'data' => $data,
            )),
        ));
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['success'])) {
            return new WP_Error('ai_error', $body['error'] ?? 'AI request failed');
        }
        
        return $body;
    }
}

// Initialize
SEO_AutoFix_Advanced::instance();
