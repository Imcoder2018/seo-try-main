<?php
/**
 * Trust & E-E-A-T Features
 * 
 * Handles author info, testimonials, trust badges, and review schema
 */

defined('ABSPATH') || exit;

class SEO_AutoFix_Trust {
    
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
        add_action('wp_head', array($this, 'output_author_schema'), 6);
        add_action('the_content', array($this, 'append_author_box'));
        add_action('wp_footer', array($this, 'output_trust_badges_footer'));
    }
    
    public function register_endpoints() {
        $namespace = 'seo-autofix/v1';
        
        register_rest_route($namespace, '/fix/author-info', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_author_info'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/testimonials', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_testimonials'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/trust-badges', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_trust_badges'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        register_rest_route($namespace, '/fix/review-schema', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_review_schema'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
    }
    
    public function register_shortcodes() {
        add_shortcode('seo_autofix_testimonials', array($this, 'shortcode_testimonials'));
        add_shortcode('seo_autofix_badges', array($this, 'shortcode_badges'));
        add_shortcode('seo_autofix_author', array($this, 'shortcode_author'));
        add_shortcode('seo_autofix_rating', array($this, 'shortcode_rating'));
    }
    
    // ==================== API ENDPOINTS ====================
    
    public function api_fix_author_info($request) {
        $author = $request->get_param('default_author');
        $display_on_posts = (bool) $request->get_param('display_on_posts');
        $display_on_pages = (bool) $request->get_param('display_on_pages');
        $add_schema = (bool) $request->get_param('add_schema');
        
        $settings = get_option('seo_autofix_settings', array());
        
        if (is_array($author)) {
            $settings['default_author_name'] = sanitize_text_field($author['name'] ?? '');
            $settings['default_author_title'] = sanitize_text_field($author['title'] ?? '');
            $settings['default_author_bio'] = sanitize_textarea_field($author['bio'] ?? '');
            $settings['default_author_photo'] = esc_url_raw($author['photo_url'] ?? '');
            
            if (!empty($author['credentials']) && is_array($author['credentials'])) {
                $settings['default_author_credentials'] = array_map('sanitize_text_field', $author['credentials']);
            }
            
            if (!empty($author['social']) && is_array($author['social'])) {
                foreach ($author['social'] as $platform => $url) {
                    $settings['author_social_' . sanitize_key($platform)] = esc_url_raw($url);
                }
            }
        }
        
        $settings['display_author_on_posts'] = $display_on_posts;
        $settings['display_author_on_pages'] = $display_on_pages;
        $settings['enable_author_schema'] = $add_schema;
        
        update_option('seo_autofix_settings', $settings);
        
        // Generate bio with AI if not provided
        if (empty($settings['default_author_bio']) && !empty($settings['default_author_name'])) {
            $bio = $this->generate_author_bio($settings);
            if ($bio) {
                $settings['default_author_bio'] = $bio;
                update_option('seo_autofix_settings', $settings);
            }
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Author information updated',
            'author' => array(
                'name' => $settings['default_author_name'] ?? '',
                'title' => $settings['default_author_title'] ?? '',
                'bio' => $settings['default_author_bio'] ?? '',
                'photo' => $settings['default_author_photo'] ?? '',
            ),
        ), 200);
    }
    
    public function api_fix_testimonials($request) {
        global $wpdb;
        
        $testimonials = $request->get_param('testimonials');
        $add_schema = (bool) $request->get_param('add_schema');
        $display_location = sanitize_text_field($request->get_param('display_location') ?: 'homepage');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['enable_testimonial_schema'] = $add_schema;
        $settings['testimonials_display_location'] = $display_location;
        update_option('seo_autofix_settings', $settings);
        
        $added = 0;
        $table = $wpdb->prefix . 'seo_autofix_testimonials';
        
        if (is_array($testimonials)) {
            foreach ($testimonials as $testimonial) {
                $wpdb->insert($table, array(
                    'author_name' => sanitize_text_field($testimonial['author'] ?? ''),
                    'author_photo' => esc_url_raw($testimonial['photo'] ?? ''),
                    'rating' => min(5, max(1, intval($testimonial['rating'] ?? 5))),
                    'review_text' => sanitize_textarea_field($testimonial['text'] ?? ''),
                    'review_date' => sanitize_text_field($testimonial['date'] ?? current_time('Y-m-d')),
                    'source' => sanitize_text_field($testimonial['source'] ?? ''),
                    'is_active' => 1,
                ));
                $added++;
            }
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => "Added $added testimonials",
            'testimonials_added' => $added,
            'schema_enabled' => $add_schema,
            'shortcode' => '[seo_autofix_testimonials]',
        ), 200);
    }
    
    public function api_fix_trust_badges($request) {
        global $wpdb;
        
        $badges = $request->get_param('badges');
        $display_location = sanitize_text_field($request->get_param('display_location') ?: 'footer');
        $add_to_about = (bool) $request->get_param('add_to_about_page');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['trust_badges_location'] = $display_location;
        $settings['trust_badges_on_about'] = $add_to_about;
        update_option('seo_autofix_settings', $settings);
        
        $added = 0;
        $table = $wpdb->prefix . 'seo_autofix_badges';
        
        if (is_array($badges)) {
            foreach ($badges as $badge) {
                $wpdb->insert($table, array(
                    'name' => sanitize_text_field($badge['name'] ?? ''),
                    'type' => sanitize_text_field($badge['type'] ?? 'certification'),
                    'image_url' => esc_url_raw($badge['image_url'] ?? ''),
                    'link_url' => esc_url_raw($badge['link_url'] ?? ''),
                    'is_active' => 1,
                ));
                $added++;
            }
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => "Added $added trust badges",
            'badges_added' => $added,
            'shortcode' => '[seo_autofix_badges]',
        ), 200);
    }
    
    public function api_fix_review_schema($request) {
        $aggregate_rating = floatval($request->get_param('aggregate_rating') ?: 0);
        $review_count = intval($request->get_param('review_count') ?: 0);
        $google_reviews_url = esc_url_raw($request->get_param('google_reviews_url') ?: '');
        
        $settings = get_option('seo_autofix_settings', array());
        $settings['aggregate_rating'] = $aggregate_rating;
        $settings['review_count'] = $review_count;
        $settings['google_reviews_url'] = $google_reviews_url;
        $settings['enable_review_schema'] = true;
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Review schema enabled',
            'aggregate_rating' => $aggregate_rating,
            'review_count' => $review_count,
        ), 200);
    }
    
    // ==================== SHORTCODES ====================
    
    public function shortcode_testimonials($atts) {
        global $wpdb;
        
        $atts = shortcode_atts(array(
            'count' => 3,
            'layout' => 'grid',
            'show_rating' => 'true',
            'show_photo' => 'true',
            'class' => '',
        ), $atts);
        
        $table = $wpdb->prefix . 'seo_autofix_testimonials';
        $testimonials = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE is_active = 1 ORDER BY display_order ASC, id DESC LIMIT %d",
            intval($atts['count'])
        ));
        
        if (empty($testimonials)) {
            return '';
        }
        
        $layout_class = 'seo-autofix-testimonials-' . esc_attr($atts['layout']);
        $class = 'seo-autofix-testimonials ' . $layout_class . ' ' . esc_attr($atts['class']);
        
        $output = '<div class="' . $class . '">';
        
        foreach ($testimonials as $t) {
            $output .= '<div class="seo-autofix-testimonial" itemscope itemtype="https://schema.org/Review">';
            
            if ($atts['show_rating'] === 'true' && $t->rating) {
                $output .= '<div class="seo-autofix-rating" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">';
                $output .= '<meta itemprop="ratingValue" content="' . esc_attr($t->rating) . '">';
                $output .= '<meta itemprop="bestRating" content="5">';
                $output .= $this->render_stars($t->rating);
                $output .= '</div>';
            }
            
            $output .= '<blockquote class="seo-autofix-review-text" itemprop="reviewBody">';
            $output .= esc_html($t->review_text);
            $output .= '</blockquote>';
            
            $output .= '<div class="seo-autofix-reviewer" itemprop="author" itemscope itemtype="https://schema.org/Person">';
            
            if ($atts['show_photo'] === 'true' && $t->author_photo) {
                $output .= '<img src="' . esc_url($t->author_photo) . '" alt="' . esc_attr($t->author_name) . '" class="seo-autofix-reviewer-photo">';
            }
            
            $output .= '<span class="seo-autofix-reviewer-name" itemprop="name">' . esc_html($t->author_name) . '</span>';
            
            if ($t->source) {
                $output .= '<span class="seo-autofix-review-source">via ' . esc_html($t->source) . '</span>';
            }
            
            $output .= '</div>';
            
            if ($t->review_date) {
                $output .= '<meta itemprop="datePublished" content="' . esc_attr($t->review_date) . '">';
            }
            
            $output .= '</div>';
        }
        
        $output .= '</div>';
        
        // Add aggregate rating schema
        if (!empty($this->settings['enable_review_schema'])) {
            $output .= $this->get_aggregate_rating_schema();
        }
        
        return $output;
    }
    
    public function shortcode_badges($atts) {
        global $wpdb;
        
        $atts = shortcode_atts(array(
            'type' => 'all',
            'layout' => 'inline',
            'class' => '',
        ), $atts);
        
        $table = $wpdb->prefix . 'seo_autofix_badges';
        $where = "is_active = 1";
        
        if ($atts['type'] !== 'all') {
            $where .= $wpdb->prepare(" AND type = %s", $atts['type']);
        }
        
        $badges = $wpdb->get_results("SELECT * FROM $table WHERE $where ORDER BY display_order ASC, id ASC");
        
        if (empty($badges)) {
            return '';
        }
        
        $layout_class = 'seo-autofix-badges-' . esc_attr($atts['layout']);
        $class = 'seo-autofix-badges ' . $layout_class . ' ' . esc_attr($atts['class']);
        
        $output = '<div class="' . $class . '">';
        
        foreach ($badges as $badge) {
            $output .= '<div class="seo-autofix-badge">';
            
            if ($badge->link_url) {
                $output .= '<a href="' . esc_url($badge->link_url) . '" target="_blank" rel="noopener">';
            }
            
            if ($badge->image_url) {
                $output .= '<img src="' . esc_url($badge->image_url) . '" alt="' . esc_attr($badge->name) . '" class="seo-autofix-badge-image">';
            } else {
                $output .= '<span class="seo-autofix-badge-name">' . esc_html($badge->name) . '</span>';
            }
            
            if ($badge->link_url) {
                $output .= '</a>';
            }
            
            $output .= '</div>';
        }
        
        $output .= '</div>';
        
        return $output;
    }
    
    public function shortcode_author($atts) {
        $atts = shortcode_atts(array(
            'show_photo' => 'true',
            'show_bio' => 'true',
            'show_credentials' => 'true',
            'show_social' => 'true',
            'class' => '',
        ), $atts);
        
        return $this->render_author_box($atts);
    }
    
    public function shortcode_rating($atts) {
        $atts = shortcode_atts(array(
            'rating' => $this->settings['aggregate_rating'] ?? '5',
            'count' => $this->settings['review_count'] ?? '',
            'show_text' => 'true',
            'class' => '',
        ), $atts);
        
        $rating = floatval($atts['rating']);
        $count = intval($atts['count']);
        
        $class = 'seo-autofix-aggregate-rating ' . esc_attr($atts['class']);
        
        $output = '<div class="' . $class . '" itemscope itemtype="https://schema.org/AggregateRating">';
        $output .= '<meta itemprop="ratingValue" content="' . esc_attr($rating) . '">';
        $output .= '<meta itemprop="bestRating" content="5">';
        
        if ($count) {
            $output .= '<meta itemprop="reviewCount" content="' . esc_attr($count) . '">';
        }
        
        $output .= $this->render_stars($rating);
        
        if ($atts['show_text'] === 'true') {
            $output .= '<span class="seo-autofix-rating-text">';
            $output .= esc_html(number_format($rating, 1));
            if ($count) {
                $output .= ' (' . esc_html($count) . ' reviews)';
            }
            $output .= '</span>';
        }
        
        $output .= '</div>';
        
        return $output;
    }
    
    // ==================== FRONTEND OUTPUT ====================
    
    public function output_author_schema() {
        if (empty($this->settings['enable_author_schema'])) {
            return;
        }
        
        if (!is_singular()) {
            return;
        }
        
        $name = $this->settings['default_author_name'] ?? '';
        if (empty($name)) {
            return;
        }
        
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $name,
        );
        
        if (!empty($this->settings['default_author_title'])) {
            $schema['jobTitle'] = $this->settings['default_author_title'];
        }
        
        if (!empty($this->settings['default_author_bio'])) {
            $schema['description'] = $this->settings['default_author_bio'];
        }
        
        if (!empty($this->settings['default_author_photo'])) {
            $schema['image'] = $this->settings['default_author_photo'];
        }
        
        // Credentials
        if (!empty($this->settings['default_author_credentials'])) {
            $schema['hasCredential'] = array();
            foreach ($this->settings['default_author_credentials'] as $cred) {
                $schema['hasCredential'][] = array(
                    '@type' => 'EducationalOccupationalCredential',
                    'credentialCategory' => 'certification',
                    'name' => $cred,
                );
            }
        }
        
        // Social profiles
        $social = array();
        $platforms = array('linkedin', 'twitter', 'facebook');
        foreach ($platforms as $platform) {
            $key = 'author_social_' . $platform;
            if (!empty($this->settings[$key])) {
                $social[] = $this->settings[$key];
            }
        }
        if (!empty($social)) {
            $schema['sameAs'] = $social;
        }
        
        // Works for organization
        if (!empty($this->settings['business_name'])) {
            $schema['worksFor'] = array(
                '@type' => 'Organization',
                'name' => $this->settings['business_name'],
                'url' => home_url(),
            );
        }
        
        echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }
    
    public function append_author_box($content) {
        if (!is_singular()) {
            return $content;
        }
        
        $show_on_posts = !empty($this->settings['display_author_on_posts']) && is_single();
        $show_on_pages = !empty($this->settings['display_author_on_pages']) && is_page();
        
        if (!$show_on_posts && !$show_on_pages) {
            return $content;
        }
        
        $author_box = $this->render_author_box();
        
        return $content . $author_box;
    }
    
    public function output_trust_badges_footer() {
        if (($this->settings['trust_badges_location'] ?? '') !== 'footer') {
            return;
        }
        
        echo '<div class="seo-autofix-footer-badges">';
        echo do_shortcode('[seo_autofix_badges]');
        echo '</div>';
    }
    
    // ==================== HELPERS ====================
    
    private function render_author_box($atts = array()) {
        $defaults = array(
            'show_photo' => 'true',
            'show_bio' => 'true',
            'show_credentials' => 'true',
            'show_social' => 'true',
            'class' => '',
        );
        $atts = wp_parse_args($atts, $defaults);
        
        $name = $this->settings['default_author_name'] ?? '';
        if (empty($name)) {
            return '';
        }
        
        $class = 'seo-autofix-author-box ' . esc_attr($atts['class']);
        
        $output = '<div class="' . $class . '" itemscope itemtype="https://schema.org/Person">';
        
        // Photo
        if ($atts['show_photo'] === 'true' && !empty($this->settings['default_author_photo'])) {
            $output .= '<div class="seo-autofix-author-photo">';
            $output .= '<img src="' . esc_url($this->settings['default_author_photo']) . '" alt="' . esc_attr($name) . '" itemprop="image">';
            $output .= '</div>';
        }
        
        $output .= '<div class="seo-autofix-author-info">';
        
        // Name & Title
        $output .= '<h4 class="seo-autofix-author-name" itemprop="name">' . esc_html($name) . '</h4>';
        
        if (!empty($this->settings['default_author_title'])) {
            $output .= '<p class="seo-autofix-author-title" itemprop="jobTitle">' . esc_html($this->settings['default_author_title']) . '</p>';
        }
        
        // Bio
        if ($atts['show_bio'] === 'true' && !empty($this->settings['default_author_bio'])) {
            $output .= '<p class="seo-autofix-author-bio" itemprop="description">' . esc_html($this->settings['default_author_bio']) . '</p>';
        }
        
        // Credentials
        if ($atts['show_credentials'] === 'true' && !empty($this->settings['default_author_credentials'])) {
            $output .= '<ul class="seo-autofix-author-credentials">';
            foreach ($this->settings['default_author_credentials'] as $cred) {
                $output .= '<li>' . esc_html($cred) . '</li>';
            }
            $output .= '</ul>';
        }
        
        // Social
        if ($atts['show_social'] === 'true') {
            $social_links = array();
            $platforms = array(
                'linkedin' => 'LinkedIn',
                'twitter' => 'Twitter',
                'facebook' => 'Facebook',
            );
            
            foreach ($platforms as $key => $label) {
                $url = $this->settings['author_social_' . $key] ?? '';
                if ($url) {
                    $social_links[] = '<a href="' . esc_url($url) . '" target="_blank" rel="noopener" itemprop="sameAs">' . $label . '</a>';
                }
            }
            
            if (!empty($social_links)) {
                $output .= '<div class="seo-autofix-author-social">' . implode(' | ', $social_links) . '</div>';
            }
        }
        
        $output .= '</div></div>';
        
        return $output;
    }
    
    private function render_stars($rating) {
        $rating = floatval($rating);
        $full_stars = floor($rating);
        $half_star = ($rating - $full_stars) >= 0.5;
        $empty_stars = 5 - $full_stars - ($half_star ? 1 : 0);
        
        $output = '<span class="seo-autofix-stars">';
        
        for ($i = 0; $i < $full_stars; $i++) {
            $output .= '★';
        }
        if ($half_star) {
            $output .= '☆';
        }
        for ($i = 0; $i < $empty_stars; $i++) {
            $output .= '☆';
        }
        
        $output .= '</span>';
        
        return $output;
    }
    
    private function get_aggregate_rating_schema() {
        $rating = $this->settings['aggregate_rating'] ?? 0;
        $count = $this->settings['review_count'] ?? 0;
        
        if (!$rating || !$count) {
            return '';
        }
        
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            'name' => $this->settings['business_name'] ?? get_bloginfo('name'),
            'aggregateRating' => array(
                '@type' => 'AggregateRating',
                'ratingValue' => $rating,
                'reviewCount' => $count,
                'bestRating' => 5,
            ),
        );
        
        return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>';
    }
    
    private function generate_author_bio($settings) {
        $api_url = $this->audit_api_url . '/api/plugin';
        
        $response = wp_remote_post($api_url, array(
            'timeout' => 30,
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'action' => 'ai_generate_bio',
                'siteUrl' => home_url(),
                'apiKey' => get_option('seo_autofix_api_key'),
                'data' => array(
                    'name' => $settings['default_author_name'] ?? '',
                    'role' => $settings['default_author_title'] ?? '',
                    'credentials' => $settings['default_author_credentials'] ?? array(),
                    'businessType' => $settings['business_type'] ?? 'Local business',
                ),
            )),
        ));
        
        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (!empty($body['bio'])) {
                return $body['bio'];
            }
        }
        
        return '';
    }
}

// Initialize
SEO_AutoFix_Trust::instance();
