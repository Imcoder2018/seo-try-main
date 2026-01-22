<?php
/**
 * Local SEO Features
 * 
 * Handles contact info, business hours, maps, click-to-call, and service areas
 */

defined('ABSPATH') || exit;

class SEO_AutoFix_Local {
    
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
        
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_endpoints'));
        
        // Register shortcodes
        add_action('init', array($this, 'register_shortcodes'));
        
        // Add frontend output
        add_action('wp_head', array($this, 'output_local_schema'), 5);
        add_action('wp_footer', array($this, 'output_business_hours_footer'));
        
        // Filter phone numbers for click-to-call
        if (!empty($this->settings['enable_click_to_call'])) {
            add_filter('the_content', array($this, 'add_click_to_call'));
        }
    }
    
    public function register_endpoints() {
        $namespace = 'seo-autofix/v1';
        
        // Contact Info
        register_rest_route($namespace, '/fix/contact-info', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_contact_info'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        // Business Hours
        register_rest_route($namespace, '/fix/business-hours', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_business_hours'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        // Service Areas
        register_rest_route($namespace, '/fix/service-areas', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_service_areas'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        // Enhanced Schema
        register_rest_route($namespace, '/fix/local-schema', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_local_schema'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
        
        // Map Embed
        register_rest_route($namespace, '/fix/map-embed', array(
            'methods' => 'POST',
            'callback' => array($this, 'api_fix_map_embed'),
            'permission_callback' => 'seo_autofix_api_permission',
        ));
    }
    
    public function register_shortcodes() {
        add_shortcode('seo_autofix_hours', array($this, 'shortcode_hours'));
        add_shortcode('seo_autofix_call_button', array($this, 'shortcode_call_button'));
        add_shortcode('seo_autofix_map', array($this, 'shortcode_map'));
        add_shortcode('seo_autofix_address', array($this, 'shortcode_address'));
        add_shortcode('seo_autofix_service_areas', array($this, 'shortcode_service_areas'));
    }
    
    // ==================== API ENDPOINTS ====================
    
    public function api_fix_contact_info($request) {
        $phone = sanitize_text_field($request->get_param('phone'));
        $email = sanitize_email($request->get_param('email'));
        $address = sanitize_text_field($request->get_param('address'));
        $enable_click_to_call = (bool) $request->get_param('enable_click_to_call');
        $add_map_embed = (bool) $request->get_param('add_map_embed');
        
        $settings = get_option('seo_autofix_settings', array());
        
        if ($phone) {
            $settings['business_phone'] = $phone;
            $settings['business_phone_display'] = $this->format_phone_display($phone);
        }
        if ($email) {
            $settings['business_email'] = $email;
        }
        if ($address) {
            $settings['business_address_full'] = $address;
            // Try to parse address
            $parsed = $this->parse_address($address);
            if ($parsed) {
                $settings['business_address'] = $parsed['street'];
                $settings['business_city'] = $parsed['city'];
                $settings['business_state'] = $parsed['state'];
                $settings['business_zip'] = $parsed['zip'];
            }
        }
        
        $settings['enable_click_to_call'] = $enable_click_to_call;
        
        if ($add_map_embed && $address) {
            $settings['enable_map_embed'] = true;
        }
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Contact information updated',
            'phone' => $settings['business_phone'] ?? '',
            'email' => $settings['business_email'] ?? '',
            'address' => $settings['business_address_full'] ?? '',
            'click_to_call' => $settings['enable_click_to_call'] ?? false,
        ), 200);
    }
    
    public function api_fix_business_hours($request) {
        $hours = $request->get_param('hours');
        $display_in_footer = (bool) $request->get_param('display_in_footer');
        $add_schema = (bool) $request->get_param('add_schema');
        
        $settings = get_option('seo_autofix_settings', array());
        
        if (is_array($hours)) {
            $settings['business_hours'] = $hours;
        }
        
        $settings['display_hours_footer'] = $display_in_footer;
        $settings['enable_hours_schema'] = $add_schema;
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Business hours updated',
            'hours' => $settings['business_hours'] ?? array(),
            'display_in_footer' => $settings['display_hours_footer'] ?? false,
            'schema_enabled' => $settings['enable_hours_schema'] ?? false,
        ), 200);
    }
    
    public function api_fix_service_areas($request) {
        global $wpdb;
        
        $service = sanitize_text_field($request->get_param('service'));
        $locations = $request->get_param('locations');
        $generate_pages = (bool) $request->get_param('generate_pages');
        $add_to_menu = (bool) $request->get_param('add_to_menu');
        
        $settings = get_option('seo_autofix_settings', array());
        
        if (is_array($locations)) {
            $settings['service_areas'] = array_map('sanitize_text_field', $locations);
        }
        
        if ($service) {
            $settings['primary_service'] = $service;
        }
        
        update_option('seo_autofix_settings', $settings);
        
        $pages_created = array();
        
        // Generate service area pages
        if ($generate_pages && $service && !empty($locations)) {
            foreach ($locations as $location) {
                $location = sanitize_text_field($location);
                $title = "$service in $location";
                $slug = sanitize_title("$service-$location");
                
                // Check if page exists
                $existing = get_page_by_path($slug);
                if ($existing) {
                    continue;
                }
                
                // Generate content using AI API
                $content = $this->generate_service_area_content($service, $location);
                
                $page_id = wp_insert_post(array(
                    'post_title' => $title,
                    'post_name' => $slug,
                    'post_content' => $content['body'] ?? "We provide professional $service services in $location and surrounding areas. Contact us today for a free quote!",
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'meta_input' => array(
                        '_seo_autofix_title' => $content['title'] ?? $title,
                        '_seo_autofix_description' => $content['meta'] ?? "Professional $service services in $location. Quality work, fair prices. Call us today!",
                        '_seo_autofix_service_area' => $location,
                    ),
                ));
                
                if ($page_id && !is_wp_error($page_id)) {
                    $pages_created[] = array(
                        'id' => $page_id,
                        'title' => $title,
                        'url' => get_permalink($page_id),
                    );
                    
                    // Store in service areas table
                    $table = $wpdb->prefix . 'seo_autofix_service_areas';
                    $wpdb->insert($table, array(
                        'name' => $location,
                        'slug' => $slug,
                        'page_id' => $page_id,
                    ));
                }
            }
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Service areas configured',
            'service_areas' => $settings['service_areas'] ?? array(),
            'pages_created' => $pages_created,
        ), 200);
    }
    
    public function api_fix_local_schema($request) {
        $data = $request->get_json_params();
        $settings = get_option('seo_autofix_settings', array());
        
        // Update all schema fields
        $schema_fields = array(
            'business_name', 'business_type', 'business_subtype', 'business_description',
            'business_phone', 'business_email', 'business_address', 'business_city',
            'business_state', 'business_zip', 'business_country', 'business_lat',
            'business_lng', 'business_price_range', 'business_payment_methods',
            'business_social_facebook', 'business_social_instagram', 'business_social_twitter',
            'business_social_linkedin', 'business_social_youtube', 'business_image',
        );
        
        foreach ($schema_fields as $field) {
            $param_name = str_replace('business_', '', $field);
            if (isset($data[$param_name])) {
                $settings[$field] = is_array($data[$param_name]) 
                    ? array_map('sanitize_text_field', $data[$param_name])
                    : sanitize_text_field($data[$param_name]);
            }
        }
        
        // Handle nested data
        if (isset($data['address']) && is_array($data['address'])) {
            $settings['business_address'] = sanitize_text_field($data['address']['street'] ?? '');
            $settings['business_city'] = sanitize_text_field($data['address']['city'] ?? '');
            $settings['business_state'] = sanitize_text_field($data['address']['state'] ?? '');
            $settings['business_zip'] = sanitize_text_field($data['address']['zip'] ?? '');
            $settings['business_country'] = sanitize_text_field($data['address']['country'] ?? 'US');
        }
        
        if (isset($data['geo']) && is_array($data['geo'])) {
            $settings['business_lat'] = floatval($data['geo']['lat'] ?? 0);
            $settings['business_lng'] = floatval($data['geo']['lng'] ?? 0);
        }
        
        if (isset($data['hours']) && is_array($data['hours'])) {
            $settings['business_hours'] = $data['hours'];
        }
        
        if (isset($data['serviceArea']) && is_array($data['serviceArea'])) {
            $settings['service_areas'] = array_map('sanitize_text_field', $data['serviceArea']);
        }
        
        if (isset($data['socialProfiles']) && is_array($data['socialProfiles'])) {
            foreach ($data['socialProfiles'] as $platform => $url) {
                $settings['business_social_' . sanitize_key($platform)] = esc_url_raw($url);
            }
        }
        
        $settings['enable_schema'] = true;
        $settings['enable_local_schema'] = true;
        
        update_option('seo_autofix_settings', $settings);
        
        // Generate and return the schema
        $schema = $this->generate_local_business_schema();
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Local business schema updated',
            'schema' => $schema,
        ), 200);
    }
    
    public function api_fix_map_embed($request) {
        $address = sanitize_text_field($request->get_param('address'));
        $api_key = sanitize_text_field($request->get_param('api_key'));
        
        $settings = get_option('seo_autofix_settings', array());
        
        if ($address) {
            $settings['business_address_full'] = $address;
        }
        if ($api_key) {
            $settings['google_maps_api_key'] = $api_key;
        }
        $settings['enable_map_embed'] = true;
        
        update_option('seo_autofix_settings', $settings);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Map embed enabled',
            'shortcode' => '[seo_autofix_map]',
        ), 200);
    }
    
    // ==================== SHORTCODES ====================
    
    public function shortcode_hours($atts) {
        $atts = shortcode_atts(array(
            'format' => 'table',
            'class' => '',
        ), $atts);
        
        $hours = $this->settings['business_hours'] ?? array();
        if (empty($hours)) {
            return '';
        }
        
        $class = 'seo-autofix-hours ' . esc_attr($atts['class']);
        $output = '<div class="' . $class . '">';
        
        if ($atts['format'] === 'table') {
            $output .= '<table class="seo-autofix-hours-table">';
            $output .= '<thead><tr><th>Day</th><th>Hours</th></tr></thead><tbody>';
            foreach ($hours as $hour) {
                $day = esc_html($hour['day'] ?? '');
                if (!empty($hour['closed'])) {
                    $time = 'Closed';
                } else {
                    $time = esc_html(($hour['open'] ?? '') . ' - ' . ($hour['close'] ?? ''));
                }
                $output .= "<tr><td>$day</td><td>$time</td></tr>";
            }
            $output .= '</tbody></table>';
        } else {
            $output .= '<ul class="seo-autofix-hours-list">';
            foreach ($hours as $hour) {
                $day = esc_html($hour['day'] ?? '');
                if (!empty($hour['closed'])) {
                    $time = 'Closed';
                } else {
                    $time = esc_html(($hour['open'] ?? '') . ' - ' . ($hour['close'] ?? ''));
                }
                $output .= "<li><strong>$day:</strong> $time</li>";
            }
            $output .= '</ul>';
        }
        
        $output .= '</div>';
        
        // Add schema
        if (!empty($this->settings['enable_hours_schema'])) {
            $output .= $this->get_hours_schema_script();
        }
        
        return $output;
    }
    
    public function shortcode_call_button($atts) {
        $atts = shortcode_atts(array(
            'text' => 'Call Now',
            'phone' => $this->settings['business_phone'] ?? '',
            'class' => '',
            'icon' => 'true',
        ), $atts);
        
        if (empty($atts['phone'])) {
            return '';
        }
        
        $phone_clean = preg_replace('/[^0-9+]/', '', $atts['phone']);
        $class = 'seo-autofix-call-button ' . esc_attr($atts['class']);
        
        $icon = '';
        if ($atts['icon'] === 'true') {
            $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
        }
        
        return sprintf(
            '<a href="tel:%s" class="%s">%s%s</a>',
            esc_attr($phone_clean),
            $class,
            $icon,
            esc_html($atts['text'])
        );
    }
    
    public function shortcode_map($atts) {
        $atts = shortcode_atts(array(
            'address' => $this->settings['business_address_full'] ?? '',
            'height' => '300',
            'width' => '100%',
            'zoom' => '15',
            'class' => '',
        ), $atts);
        
        if (empty($atts['address'])) {
            return '';
        }
        
        $address_encoded = urlencode($atts['address']);
        $api_key = $this->settings['google_maps_api_key'] ?? '';
        
        // Use Google Maps embed
        if ($api_key) {
            $src = "https://www.google.com/maps/embed/v1/place?key={$api_key}&q={$address_encoded}";
        } else {
            // Fallback to OpenStreetMap
            $src = "https://www.openstreetmap.org/export/embed.html?bbox=-0.1,51.5,-0.1,51.5&layer=mapnik&marker={$address_encoded}";
        }
        
        $class = 'seo-autofix-map ' . esc_attr($atts['class']);
        
        return sprintf(
            '<div class="%s"><iframe src="%s" width="%s" height="%s" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>',
            $class,
            esc_url($src),
            esc_attr($atts['width']),
            esc_attr($atts['height'])
        );
    }
    
    public function shortcode_address($atts) {
        $atts = shortcode_atts(array(
            'format' => 'full',
            'link' => 'true',
            'schema' => 'true',
            'class' => '',
        ), $atts);
        
        $parts = array();
        if (!empty($this->settings['business_address'])) {
            $parts[] = $this->settings['business_address'];
        }
        if (!empty($this->settings['business_city'])) {
            $city_state = $this->settings['business_city'];
            if (!empty($this->settings['business_state'])) {
                $city_state .= ', ' . $this->settings['business_state'];
            }
            if (!empty($this->settings['business_zip'])) {
                $city_state .= ' ' . $this->settings['business_zip'];
            }
            $parts[] = $city_state;
        }
        
        if (empty($parts)) {
            return '';
        }
        
        $address = implode(', ', $parts);
        $class = 'seo-autofix-address ' . esc_attr($atts['class']);
        
        $output = '<address class="' . $class . '"';
        if ($atts['schema'] === 'true') {
            $output .= ' itemscope itemtype="https://schema.org/PostalAddress"';
        }
        $output .= '>';
        
        if ($atts['link'] === 'true') {
            $map_url = 'https://maps.google.com/?q=' . urlencode($address);
            $output .= '<a href="' . esc_url($map_url) . '" target="_blank" rel="noopener">';
        }
        
        if ($atts['schema'] === 'true') {
            if (!empty($this->settings['business_address'])) {
                $output .= '<span itemprop="streetAddress">' . esc_html($this->settings['business_address']) . '</span>, ';
            }
            if (!empty($this->settings['business_city'])) {
                $output .= '<span itemprop="addressLocality">' . esc_html($this->settings['business_city']) . '</span>';
            }
            if (!empty($this->settings['business_state'])) {
                $output .= ', <span itemprop="addressRegion">' . esc_html($this->settings['business_state']) . '</span>';
            }
            if (!empty($this->settings['business_zip'])) {
                $output .= ' <span itemprop="postalCode">' . esc_html($this->settings['business_zip']) . '</span>';
            }
        } else {
            $output .= esc_html($address);
        }
        
        if ($atts['link'] === 'true') {
            $output .= '</a>';
        }
        
        $output .= '</address>';
        
        return $output;
    }
    
    public function shortcode_service_areas($atts) {
        $atts = shortcode_atts(array(
            'show_map' => 'false',
            'link_pages' => 'true',
            'class' => '',
        ), $atts);
        
        $areas = $this->settings['service_areas'] ?? array();
        if (empty($areas)) {
            return '';
        }
        
        $class = 'seo-autofix-service-areas ' . esc_attr($atts['class']);
        $output = '<div class="' . $class . '">';
        $output .= '<ul class="seo-autofix-areas-list">';
        
        foreach ($areas as $area) {
            $output .= '<li>';
            
            if ($atts['link_pages'] === 'true') {
                $service = $this->settings['primary_service'] ?? '';
                $slug = sanitize_title($service . '-' . $area);
                $page = get_page_by_path($slug);
                if ($page) {
                    $output .= '<a href="' . get_permalink($page->ID) . '">';
                }
            }
            
            $output .= esc_html($area);
            
            if ($atts['link_pages'] === 'true' && isset($page) && $page) {
                $output .= '</a>';
            }
            
            $output .= '</li>';
        }
        
        $output .= '</ul></div>';
        
        return $output;
    }
    
    // ==================== FRONTEND OUTPUT ====================
    
    public function output_local_schema() {
        if (empty($this->settings['enable_local_schema']) && empty($this->settings['enable_schema'])) {
            return;
        }
        
        $schema = $this->generate_local_business_schema();
        if ($schema) {
            echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
        }
    }
    
    public function output_business_hours_footer() {
        if (empty($this->settings['display_hours_footer'])) {
            return;
        }
        
        echo '<div class="seo-autofix-footer-hours">';
        echo do_shortcode('[seo_autofix_hours format="list"]');
        echo '</div>';
    }
    
    public function add_click_to_call($content) {
        // Find phone numbers and wrap them in tel: links
        $pattern = '/(?<!\")(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})(?!\")/';
        
        $content = preg_replace_callback($pattern, function($matches) {
            $phone = $matches[1];
            $phone_clean = preg_replace('/[^0-9+]/', '', $phone);
            
            // Don't wrap if already in a link
            return '<a href="tel:' . $phone_clean . '" class="seo-autofix-phone-link">' . $phone . '</a>';
        }, $content);
        
        return $content;
    }
    
    // ==================== HELPERS ====================
    
    private function generate_local_business_schema() {
        $name = $this->settings['business_name'] ?? get_bloginfo('name');
        if (empty($name)) {
            return null;
        }
        
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => $this->settings['business_subtype'] ?? $this->settings['business_type'] ?? 'LocalBusiness',
            'name' => $name,
            'url' => home_url(),
        );
        
        // Description
        if (!empty($this->settings['business_description'])) {
            $schema['description'] = $this->settings['business_description'];
        }
        
        // Contact
        if (!empty($this->settings['business_phone'])) {
            $schema['telephone'] = $this->settings['business_phone'];
        }
        if (!empty($this->settings['business_email'])) {
            $schema['email'] = $this->settings['business_email'];
        }
        
        // Address
        $has_address = !empty($this->settings['business_address']) || !empty($this->settings['business_city']);
        if ($has_address) {
            $schema['address'] = array(
                '@type' => 'PostalAddress',
            );
            if (!empty($this->settings['business_address'])) {
                $schema['address']['streetAddress'] = $this->settings['business_address'];
            }
            if (!empty($this->settings['business_city'])) {
                $schema['address']['addressLocality'] = $this->settings['business_city'];
            }
            if (!empty($this->settings['business_state'])) {
                $schema['address']['addressRegion'] = $this->settings['business_state'];
            }
            if (!empty($this->settings['business_zip'])) {
                $schema['address']['postalCode'] = $this->settings['business_zip'];
            }
            $schema['address']['addressCountry'] = $this->settings['business_country'] ?? 'US';
        }
        
        // Geo
        if (!empty($this->settings['business_lat']) && !empty($this->settings['business_lng'])) {
            $schema['geo'] = array(
                '@type' => 'GeoCoordinates',
                'latitude' => $this->settings['business_lat'],
                'longitude' => $this->settings['business_lng'],
            );
        }
        
        // Opening Hours
        if (!empty($this->settings['business_hours'])) {
            $schema['openingHoursSpecification'] = array();
            foreach ($this->settings['business_hours'] as $hour) {
                if (empty($hour['closed'])) {
                    $schema['openingHoursSpecification'][] = array(
                        '@type' => 'OpeningHoursSpecification',
                        'dayOfWeek' => $hour['day'] ?? '',
                        'opens' => $hour['open'] ?? '',
                        'closes' => $hour['close'] ?? '',
                    );
                }
            }
        }
        
        // Service Area
        if (!empty($this->settings['service_areas'])) {
            $schema['areaServed'] = array();
            foreach ($this->settings['service_areas'] as $area) {
                $schema['areaServed'][] = array(
                    '@type' => 'City',
                    'name' => $area,
                );
            }
        }
        
        // Price Range
        if (!empty($this->settings['business_price_range'])) {
            $schema['priceRange'] = $this->settings['business_price_range'];
        }
        
        // Payment Methods
        if (!empty($this->settings['business_payment_methods'])) {
            $schema['paymentAccepted'] = is_array($this->settings['business_payment_methods']) 
                ? implode(', ', $this->settings['business_payment_methods'])
                : $this->settings['business_payment_methods'];
        }
        
        // Social Profiles
        $social = array();
        $platforms = array('facebook', 'instagram', 'twitter', 'linkedin', 'youtube');
        foreach ($platforms as $platform) {
            $key = 'business_social_' . $platform;
            if (!empty($this->settings[$key])) {
                $social[] = $this->settings[$key];
            }
        }
        if (!empty($social)) {
            $schema['sameAs'] = $social;
        }
        
        // Image
        if (!empty($this->settings['business_image'])) {
            $schema['image'] = $this->settings['business_image'];
        }
        
        return $schema;
    }
    
    private function get_hours_schema_script() {
        $hours = $this->settings['business_hours'] ?? array();
        if (empty($hours)) {
            return '';
        }
        
        $specs = array();
        foreach ($hours as $hour) {
            if (empty($hour['closed'])) {
                $specs[] = array(
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => $hour['day'] ?? '',
                    'opens' => $hour['open'] ?? '',
                    'closes' => $hour['close'] ?? '',
                );
            }
        }
        
        if (empty($specs)) {
            return '';
        }
        
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            'name' => $this->settings['business_name'] ?? get_bloginfo('name'),
            'openingHoursSpecification' => $specs,
        );
        
        return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>';
    }
    
    private function format_phone_display($phone) {
        $clean = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($clean) === 10) {
            return '(' . substr($clean, 0, 3) . ') ' . substr($clean, 3, 3) . '-' . substr($clean, 6);
        } elseif (strlen($clean) === 11 && $clean[0] === '1') {
            return '1 (' . substr($clean, 1, 3) . ') ' . substr($clean, 4, 3) . '-' . substr($clean, 7);
        }
        return $phone;
    }
    
    private function parse_address($address) {
        // Simple address parser
        $parts = array_map('trim', explode(',', $address));
        if (count($parts) < 2) {
            return null;
        }
        
        $result = array(
            'street' => $parts[0],
            'city' => '',
            'state' => '',
            'zip' => '',
        );
        
        // Try to parse city, state, zip from remaining parts
        if (count($parts) >= 2) {
            $city_state_zip = trim($parts[1]);
            // Match patterns like "Denver, CO 80202" or "Denver CO 80202"
            if (preg_match('/^([^,]+?)[\s,]+([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/i', $city_state_zip, $matches)) {
                $result['city'] = trim($matches[1]);
                $result['state'] = strtoupper($matches[2]);
                $result['zip'] = $matches[3] ?? '';
            } else {
                $result['city'] = $city_state_zip;
            }
        }
        
        if (count($parts) >= 3) {
            $state_zip = trim($parts[2]);
            if (preg_match('/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/i', $state_zip, $matches)) {
                $result['state'] = strtoupper($matches[1]);
                $result['zip'] = $matches[2] ?? '';
            }
        }
        
        return $result;
    }
    
    private function generate_service_area_content($service, $location) {
        // Try to use AI API
        $api_url = $this->audit_api_url . '/api/plugin';
        $settings = get_option('seo_autofix_settings', array());
        
        $response = wp_remote_post($api_url, array(
            'timeout' => 30,
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'action' => 'ai_generate_content',
                'siteUrl' => home_url(),
                'apiKey' => get_option('seo_autofix_api_key'),
                'data' => array(
                    'service' => $service,
                    'location' => $location,
                    'businessName' => $settings['business_name'] ?? get_bloginfo('name'),
                    'phone' => $settings['business_phone'] ?? '',
                ),
            )),
        ));
        
        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (!empty($body['content'])) {
                return array(
                    'title' => $body['content']['title'] ?? "$service in $location",
                    'meta' => $body['content']['metaDescription'] ?? '',
                    'body' => $this->format_page_content($body['content'], $service, $location),
                );
            }
        }
        
        // Fallback content
        return array(
            'title' => "$service in $location",
            'meta' => "Professional $service services in $location. Quality work at fair prices. Contact us today!",
            'body' => $this->get_default_service_area_content($service, $location),
        );
    }
    
    private function format_page_content($content, $service, $location) {
        $html = '<h1>' . esc_html($content['h1'] ?? "$service in $location") . '</h1>';
        
        if (!empty($content['intro'])) {
            $html .= '<p>' . esc_html($content['intro']) . '</p>';
        }
        
        if (!empty($content['benefits']) && is_array($content['benefits'])) {
            $html .= '<h2>Why Choose Us for ' . esc_html($service) . ' in ' . esc_html($location) . '</h2>';
            $html .= '<ul>';
            foreach ($content['benefits'] as $benefit) {
                $html .= '<li>' . esc_html($benefit) . '</li>';
            }
            $html .= '</ul>';
        }
        
        if (!empty($content['cta'])) {
            $html .= '<p><strong>' . esc_html($content['cta']) . '</strong></p>';
        }
        
        $html .= '[seo_autofix_call_button text="Call Now for ' . esc_attr($service) . ' in ' . esc_attr($location) . '"]';
        
        return $html;
    }
    
    private function get_default_service_area_content($service, $location) {
        $settings = get_option('seo_autofix_settings', array());
        $business = $settings['business_name'] ?? get_bloginfo('name');
        
        return "
<h1>$service in $location</h1>

<p>Looking for professional $service services in $location? $business is your trusted local provider, delivering quality workmanship and exceptional customer service to residents and businesses throughout $location and the surrounding areas.</p>

<h2>Why Choose Us for $service in $location</h2>

<ul>
<li><strong>Local Expertise:</strong> We know $location and understand the unique needs of our community.</li>
<li><strong>Quality Service:</strong> Our experienced team delivers top-notch $service every time.</li>
<li><strong>Fair Pricing:</strong> Competitive rates with no hidden fees or surprises.</li>
<li><strong>Fast Response:</strong> Quick turnaround times to get your project done right.</li>
</ul>

<h2>Our $service Services in $location</h2>

<p>We offer comprehensive $service solutions for both residential and commercial customers in $location. Whether you need routine maintenance, repairs, or new installations, our skilled professionals are ready to help.</p>

<h2>Contact Us Today</h2>

<p>Ready to get started with your $service project in $location? Contact us today for a free estimate!</p>

[seo_autofix_call_button text=\"Call Now for a Free Quote\"]

[seo_autofix_address]
";
    }
}

// Initialize
SEO_AutoFix_Local::instance();
