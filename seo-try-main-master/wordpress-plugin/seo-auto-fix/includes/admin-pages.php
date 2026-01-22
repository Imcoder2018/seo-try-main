<?php
/**
 * Additional Admin Pages for SEO AutoFix Pro
 * 
 * Local SEO, Testimonials, Performance, Accessibility, Analytics
 */

defined('ABSPATH') || exit;

// ==================== LOCAL SEO PAGE ====================
function seo_autofix_local_page() {
    $settings = get_option('seo_autofix_settings', array());
    
    if (isset($_POST['save_local_seo']) && check_admin_referer('seo_autofix_local')) {
        $settings['business_name'] = sanitize_text_field($_POST['business_name']);
        $settings['business_type'] = sanitize_text_field($_POST['business_type']);
        $settings['business_subtype'] = sanitize_text_field($_POST['business_subtype']);
        $settings['business_description'] = sanitize_textarea_field($_POST['business_description']);
        $settings['business_phone'] = sanitize_text_field($_POST['business_phone']);
        $settings['business_email'] = sanitize_email($_POST['business_email']);
        $settings['business_address'] = sanitize_text_field($_POST['business_address']);
        $settings['business_city'] = sanitize_text_field($_POST['business_city']);
        $settings['business_state'] = sanitize_text_field($_POST['business_state']);
        $settings['business_zip'] = sanitize_text_field($_POST['business_zip']);
        $settings['business_country'] = sanitize_text_field($_POST['business_country']);
        $settings['business_lat'] = floatval($_POST['business_lat']);
        $settings['business_lng'] = floatval($_POST['business_lng']);
        $settings['business_price_range'] = sanitize_text_field($_POST['business_price_range']);
        $settings['enable_click_to_call'] = isset($_POST['enable_click_to_call']);
        $settings['enable_local_schema'] = isset($_POST['enable_local_schema']);
        $settings['google_maps_api_key'] = sanitize_text_field($_POST['google_maps_api_key']);
        
        // Business hours
        if (!empty($_POST['hours'])) {
            $settings['business_hours'] = array();
            foreach ($_POST['hours'] as $day => $hour) {
                if (!empty($hour['open']) || !empty($hour['closed'])) {
                    $settings['business_hours'][] = array(
                        'day' => sanitize_text_field($day),
                        'open' => sanitize_text_field($hour['open'] ?? ''),
                        'close' => sanitize_text_field($hour['close'] ?? ''),
                        'closed' => !empty($hour['closed']),
                    );
                }
            }
        }
        
        // Service areas
        if (!empty($_POST['service_areas'])) {
            $settings['service_areas'] = array_filter(array_map('sanitize_text_field', explode("\n", $_POST['service_areas'])));
        }
        
        // Social profiles
        $settings['business_social_facebook'] = esc_url_raw($_POST['social_facebook'] ?? '');
        $settings['business_social_instagram'] = esc_url_raw($_POST['social_instagram'] ?? '');
        $settings['business_social_twitter'] = esc_url_raw($_POST['social_twitter'] ?? '');
        $settings['business_social_linkedin'] = esc_url_raw($_POST['social_linkedin'] ?? '');
        $settings['business_social_youtube'] = esc_url_raw($_POST['social_youtube'] ?? '');
        
        update_option('seo_autofix_settings', $settings);
        echo '<div class="notice notice-success"><p>Local SEO settings saved!</p></div>';
    }
    
    $days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    $hours_map = array();
    foreach ($settings['business_hours'] ?? array() as $h) {
        $hours_map[$h['day']] = $h;
    }
    ?>
    <div class="wrap seo-autofix-wrap">
        <h1><span class="dashicons dashicons-location"></span> Local SEO Settings</h1>
        
        <form method="post">
            <?php wp_nonce_field('seo_autofix_local'); ?>
            
            <div class="seo-autofix-grid">
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Business Information</h3>
                    <table class="form-table">
                        <tr>
                            <th>Business Name</th>
                            <td><input type="text" name="business_name" value="<?php echo esc_attr($settings['business_name'] ?? ''); ?>" class="regular-text"></td>
                        </tr>
                        <tr>
                            <th>Business Type</th>
                            <td>
                                <select name="business_type">
                                    <?php
                                    $types = array('LocalBusiness', 'Restaurant', 'Store', 'ProfessionalService', 'HomeAndConstructionBusiness', 'HealthAndBeautyBusiness', 'AutomotiveBusiness', 'FinancialService', 'LegalService', 'MedicalBusiness');
                                    foreach ($types as $t): ?>
                                        <option value="<?php echo $t; ?>" <?php selected($settings['business_type'] ?? '', $t); ?>><?php echo $t; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Subtype (Optional)</th>
                            <td><input type="text" name="business_subtype" value="<?php echo esc_attr($settings['business_subtype'] ?? ''); ?>" placeholder="e.g., Plumber, Electrician, Dentist"></td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td><textarea name="business_description" rows="3" class="large-text"><?php echo esc_textarea($settings['business_description'] ?? ''); ?></textarea></td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>
                                <input type="text" name="business_phone" value="<?php echo esc_attr($settings['business_phone'] ?? ''); ?>" placeholder="+1-555-123-4567">
                                <label style="margin-left:10px;"><input type="checkbox" name="enable_click_to_call" <?php checked(!empty($settings['enable_click_to_call'])); ?>> Enable Click-to-Call</label>
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td><input type="email" name="business_email" value="<?php echo esc_attr($settings['business_email'] ?? ''); ?>"></td>
                        </tr>
                        <tr>
                            <th>Price Range</th>
                            <td>
                                <select name="business_price_range">
                                    <option value="">-- Select --</option>
                                    <option value="$" <?php selected($settings['business_price_range'] ?? '', '$'); ?>>$ - Budget</option>
                                    <option value="$$" <?php selected($settings['business_price_range'] ?? '', '$$'); ?>>$$ - Moderate</option>
                                    <option value="$$$" <?php selected($settings['business_price_range'] ?? '', '$$$'); ?>>$$$ - Premium</option>
                                    <option value="$$$$" <?php selected($settings['business_price_range'] ?? '', '$$$$'); ?>>$$$$ - Luxury</option>
                                </select>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Address & Location</h3>
                    <table class="form-table">
                        <tr>
                            <th>Street Address</th>
                            <td><input type="text" name="business_address" value="<?php echo esc_attr($settings['business_address'] ?? ''); ?>" class="regular-text"></td>
                        </tr>
                        <tr>
                            <th>City</th>
                            <td><input type="text" name="business_city" value="<?php echo esc_attr($settings['business_city'] ?? ''); ?>"></td>
                        </tr>
                        <tr>
                            <th>State/Region</th>
                            <td><input type="text" name="business_state" value="<?php echo esc_attr($settings['business_state'] ?? ''); ?>"></td>
                        </tr>
                        <tr>
                            <th>ZIP/Postal Code</th>
                            <td><input type="text" name="business_zip" value="<?php echo esc_attr($settings['business_zip'] ?? ''); ?>"></td>
                        </tr>
                        <tr>
                            <th>Country</th>
                            <td><input type="text" name="business_country" value="<?php echo esc_attr($settings['business_country'] ?? 'US'); ?>"></td>
                        </tr>
                        <tr>
                            <th>Coordinates</th>
                            <td>
                                <input type="text" name="business_lat" value="<?php echo esc_attr($settings['business_lat'] ?? ''); ?>" placeholder="Latitude" style="width:120px;">
                                <input type="text" name="business_lng" value="<?php echo esc_attr($settings['business_lng'] ?? ''); ?>" placeholder="Longitude" style="width:120px;">
                            </td>
                        </tr>
                        <tr>
                            <th>Google Maps API Key</th>
                            <td><input type="text" name="google_maps_api_key" value="<?php echo esc_attr($settings['google_maps_api_key'] ?? ''); ?>" class="regular-text" placeholder="For embedded maps"></td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="seo-autofix-grid">
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Business Hours</h3>
                    <table class="seo-autofix-table">
                        <thead><tr><th>Day</th><th>Open</th><th>Close</th><th>Closed</th></tr></thead>
                        <tbody>
                        <?php foreach ($days as $day): $h = $hours_map[$day] ?? array(); ?>
                            <tr>
                                <td><strong><?php echo $day; ?></strong></td>
                                <td><input type="time" name="hours[<?php echo $day; ?>][open]" value="<?php echo esc_attr($h['open'] ?? '09:00'); ?>"></td>
                                <td><input type="time" name="hours[<?php echo $day; ?>][close]" value="<?php echo esc_attr($h['close'] ?? '17:00'); ?>"></td>
                                <td><input type="checkbox" name="hours[<?php echo $day; ?>][closed]" <?php checked(!empty($h['closed'])); ?>></td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Service Areas</h3>
                    <p>Enter each service area on a new line:</p>
                    <textarea name="service_areas" rows="8" class="large-text"><?php echo esc_textarea(implode("\n", $settings['service_areas'] ?? array())); ?></textarea>
                    
                    <h3>Social Media Profiles</h3>
                    <p><input type="url" name="social_facebook" value="<?php echo esc_attr($settings['business_social_facebook'] ?? ''); ?>" class="regular-text" placeholder="Facebook URL"></p>
                    <p><input type="url" name="social_instagram" value="<?php echo esc_attr($settings['business_social_instagram'] ?? ''); ?>" class="regular-text" placeholder="Instagram URL"></p>
                    <p><input type="url" name="social_twitter" value="<?php echo esc_attr($settings['business_social_twitter'] ?? ''); ?>" class="regular-text" placeholder="Twitter/X URL"></p>
                    <p><input type="url" name="social_linkedin" value="<?php echo esc_attr($settings['business_social_linkedin'] ?? ''); ?>" class="regular-text" placeholder="LinkedIn URL"></p>
                    <p><input type="url" name="social_youtube" value="<?php echo esc_attr($settings['business_social_youtube'] ?? ''); ?>" class="regular-text" placeholder="YouTube URL"></p>
                </div>
            </div>
            
            <div class="seo-autofix-card">
                <p>
                    <label><input type="checkbox" name="enable_local_schema" <?php checked(!empty($settings['enable_local_schema'])); ?>> <strong>Enable Local Business Schema</strong></label>
                </p>
                <p><button type="submit" name="save_local_seo" class="button button-primary button-hero">Save Local SEO Settings</button></p>
                
                <h3>Available Shortcodes</h3>
                <ul>
                    <li><code>[seo_autofix_hours]</code> - Display business hours</li>
                    <li><code>[seo_autofix_call_button text="Call Now"]</code> - Click-to-call button</li>
                    <li><code>[seo_autofix_map]</code> - Embedded Google Map</li>
                    <li><code>[seo_autofix_address]</code> - Display address with schema</li>
                    <li><code>[seo_autofix_service_areas]</code> - List service areas</li>
                </ul>
            </div>
        </form>
    </div>
    <?php
}

// ==================== TESTIMONIALS PAGE ====================
function seo_autofix_testimonials_page() {
    global $wpdb;
    $table = $wpdb->prefix . 'seo_autofix_testimonials';
    $settings = get_option('seo_autofix_settings', array());
    
    // Add testimonial
    if (isset($_POST['add_testimonial']) && check_admin_referer('seo_autofix_testimonials')) {
        $wpdb->insert($table, array(
            'author_name' => sanitize_text_field($_POST['author_name']),
            'author_photo' => esc_url_raw($_POST['author_photo']),
            'rating' => min(5, max(1, intval($_POST['rating']))),
            'review_text' => sanitize_textarea_field($_POST['review_text']),
            'review_date' => sanitize_text_field($_POST['review_date'] ?: current_time('Y-m-d')),
            'source' => sanitize_text_field($_POST['source']),
            'is_active' => 1,
        ));
        echo '<div class="notice notice-success"><p>Testimonial added!</p></div>';
    }
    
    // Delete testimonial
    if (isset($_GET['delete_testimonial'])) {
        $wpdb->delete($table, array('id' => intval($_GET['delete_testimonial'])));
    }
    
    // Save settings
    if (isset($_POST['save_testimonial_settings']) && check_admin_referer('seo_autofix_testimonials')) {
        $settings['enable_testimonial_schema'] = isset($_POST['enable_testimonial_schema']);
        $settings['aggregate_rating'] = floatval($_POST['aggregate_rating']);
        $settings['review_count'] = intval($_POST['review_count']);
        $settings['google_reviews_url'] = esc_url_raw($_POST['google_reviews_url']);
        update_option('seo_autofix_settings', $settings);
        echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
    }
    
    $testimonials = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC LIMIT 50");
    ?>
    <div class="wrap seo-autofix-wrap">
        <h1><span class="dashicons dashicons-star-filled"></span> Testimonials & Reviews</h1>
        
        <div class="seo-autofix-grid">
            <div class="seo-autofix-card">
                <h3 style="margin-top:0;">Add Testimonial</h3>
                <form method="post">
                    <?php wp_nonce_field('seo_autofix_testimonials'); ?>
                    <table class="form-table">
                        <tr><th>Name</th><td><input type="text" name="author_name" required class="regular-text"></td></tr>
                        <tr><th>Photo URL</th><td><input type="url" name="author_photo" class="regular-text" placeholder="Optional"></td></tr>
                        <tr><th>Rating</th><td>
                            <select name="rating">
                                <?php for ($i = 5; $i >= 1; $i--): ?>
                                    <option value="<?php echo $i; ?>"><?php echo str_repeat('★', $i) . str_repeat('☆', 5-$i); ?></option>
                                <?php endfor; ?>
                            </select>
                        </td></tr>
                        <tr><th>Review</th><td><textarea name="review_text" rows="3" class="large-text" required></textarea></td></tr>
                        <tr><th>Date</th><td><input type="date" name="review_date" value="<?php echo current_time('Y-m-d'); ?>"></td></tr>
                        <tr><th>Source</th><td><input type="text" name="source" placeholder="Google, Yelp, etc."></td></tr>
                    </table>
                    <p><button type="submit" name="add_testimonial" class="button button-primary">Add Testimonial</button></p>
                </form>
            </div>
            
            <div class="seo-autofix-card">
                <h3 style="margin-top:0;">Review Settings</h3>
                <form method="post">
                    <?php wp_nonce_field('seo_autofix_testimonials'); ?>
                    <table class="form-table">
                        <tr>
                            <th>Enable Review Schema</th>
                            <td><label><input type="checkbox" name="enable_testimonial_schema" <?php checked(!empty($settings['enable_testimonial_schema'])); ?>> Add schema markup</label></td>
                        </tr>
                        <tr>
                            <th>Aggregate Rating</th>
                            <td><input type="number" name="aggregate_rating" value="<?php echo esc_attr($settings['aggregate_rating'] ?? ''); ?>" min="1" max="5" step="0.1" style="width:80px;"> / 5</td>
                        </tr>
                        <tr>
                            <th>Total Reviews</th>
                            <td><input type="number" name="review_count" value="<?php echo esc_attr($settings['review_count'] ?? ''); ?>" min="0"></td>
                        </tr>
                        <tr>
                            <th>Google Reviews URL</th>
                            <td><input type="url" name="google_reviews_url" value="<?php echo esc_attr($settings['google_reviews_url'] ?? ''); ?>" class="regular-text" placeholder="Link to your Google reviews"></td>
                        </tr>
                    </table>
                    <p><button type="submit" name="save_testimonial_settings" class="button button-primary">Save Settings</button></p>
                </form>
                
                <h3>Shortcode</h3>
                <p><code>[seo_autofix_testimonials count="3" layout="grid"]</code></p>
                <p><code>[seo_autofix_rating]</code> - Show aggregate rating</p>
            </div>
        </div>
        
        <?php if ($testimonials): ?>
        <div class="seo-autofix-card">
            <h3 style="margin-top:0;">Existing Testimonials</h3>
            <table class="seo-autofix-table">
                <thead><tr><th>Author</th><th>Rating</th><th>Review</th><th>Source</th><th>Actions</th></tr></thead>
                <tbody>
                <?php foreach ($testimonials as $t): ?>
                    <tr>
                        <td><strong><?php echo esc_html($t->author_name); ?></strong></td>
                        <td><?php echo str_repeat('★', $t->rating) . str_repeat('☆', 5-$t->rating); ?></td>
                        <td><?php echo esc_html(wp_trim_words($t->review_text, 15)); ?></td>
                        <td><?php echo esc_html($t->source); ?></td>
                        <td><a href="?page=seo-auto-fix-testimonials&delete_testimonial=<?php echo $t->id; ?>" class="button button-small" onclick="return confirm('Delete?');">Delete</a></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
    </div>
    <?php
}

// ==================== PERFORMANCE PAGE ====================
function seo_autofix_performance_page() {
    $settings = get_option('seo_autofix_settings', array());
    
    if (isset($_POST['save_performance']) && check_admin_referer('seo_autofix_performance')) {
        $settings['enable_resource_hints'] = isset($_POST['enable_resource_hints']);
        $settings['defer_js'] = isset($_POST['defer_js']);
        $settings['async_analytics'] = isset($_POST['async_analytics']);
        $settings['remove_jquery_migrate'] = isset($_POST['remove_jquery_migrate']);
        $settings['inline_critical_css'] = isset($_POST['inline_critical_css']);
        $settings['defer_css'] = isset($_POST['defer_css']);
        
        if (!empty($_POST['preconnect_domains'])) {
            $settings['preconnect_domains'] = array_filter(array_map('esc_url_raw', explode("\n", $_POST['preconnect_domains'])));
        }
        
        if (!empty($_POST['lcp_image'])) {
            $settings['lcp_image'] = esc_url_raw($_POST['lcp_image']);
        }
        
        update_option('seo_autofix_settings', $settings);
        echo '<div class="notice notice-success"><p>Performance settings saved!</p></div>';
    }
    ?>
    <div class="wrap seo-autofix-wrap">
        <h1><span class="dashicons dashicons-performance"></span> Performance Optimization</h1>
        
        <form method="post">
            <?php wp_nonce_field('seo_autofix_performance'); ?>
            
            <div class="seo-autofix-grid">
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Resource Hints</h3>
                    <p><label><input type="checkbox" name="enable_resource_hints" <?php checked(!empty($settings['enable_resource_hints'])); ?>> Enable preconnect/dns-prefetch</label></p>
                    <p>Preconnect domains (one per line):</p>
                    <textarea name="preconnect_domains" rows="4" class="large-text"><?php echo esc_textarea(implode("\n", $settings['preconnect_domains'] ?? array())); ?></textarea>
                    <p class="description">Common: fonts.googleapis.com, fonts.gstatic.com, www.google-analytics.com</p>
                    
                    <h4>LCP Image Preload</h4>
                    <input type="url" name="lcp_image" value="<?php echo esc_attr($settings['lcp_image'] ?? ''); ?>" class="large-text" placeholder="URL of your largest contentful paint image">
                </div>
                
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">JavaScript Optimization</h3>
                    <p><label><input type="checkbox" name="defer_js" <?php checked(!empty($settings['defer_js'])); ?>> Defer non-critical JavaScript</label></p>
                    <p><label><input type="checkbox" name="async_analytics" <?php checked(!empty($settings['async_analytics'])); ?>> Async load analytics scripts</label></p>
                    <p><label><input type="checkbox" name="remove_jquery_migrate" <?php checked(!empty($settings['remove_jquery_migrate'])); ?>> Remove jQuery Migrate</label></p>
                    <p class="description">May break some older plugins. Test thoroughly.</p>
                    
                    <h3>CSS Optimization</h3>
                    <p><label><input type="checkbox" name="inline_critical_css" <?php checked(!empty($settings['inline_critical_css'])); ?>> Inline critical CSS</label></p>
                    <p><label><input type="checkbox" name="defer_css" <?php checked(!empty($settings['defer_css'])); ?>> Defer non-critical CSS</label></p>
                </div>
            </div>
            
            <div class="seo-autofix-card">
                <p><button type="submit" name="save_performance" class="button button-primary button-hero">Save Performance Settings</button></p>
            </div>
        </form>
    </div>
    <?php
}

// ==================== ACCESSIBILITY PAGE ====================
function seo_autofix_a11y_page() {
    $settings = get_option('seo_autofix_settings', array());
    
    if (isset($_POST['save_a11y']) && check_admin_referer('seo_autofix_a11y')) {
        $settings['enable_skip_link'] = isset($_POST['enable_skip_link']);
        $settings['skip_link_text'] = sanitize_text_field($_POST['skip_link_text'] ?: 'Skip to main content');
        $settings['skip_link_target'] = sanitize_text_field($_POST['skip_link_target'] ?: 'main-content');
        $settings['enable_focus_styles'] = isset($_POST['enable_focus_styles']);
        $settings['focus_outline_color'] = sanitize_hex_color($_POST['focus_outline_color'] ?: '#005fcc');
        $settings['focus_outline_width'] = sanitize_text_field($_POST['focus_outline_width'] ?: '3px');
        $settings['add_link_warnings'] = isset($_POST['add_link_warnings']);
        $settings['link_aria_labels'] = isset($_POST['link_aria_labels']);
        $settings['link_visual_indicator'] = isset($_POST['link_visual_indicator']);
        $settings['link_indicator_text'] = sanitize_text_field($_POST['link_indicator_text'] ?: '(opens in new tab)');
        
        update_option('seo_autofix_settings', $settings);
        echo '<div class="notice notice-success"><p>Accessibility settings saved!</p></div>';
    }
    ?>
    <div class="wrap seo-autofix-wrap">
        <h1><span class="dashicons dashicons-universal-access-alt"></span> Accessibility (WCAG)</h1>
        
        <form method="post">
            <?php wp_nonce_field('seo_autofix_a11y'); ?>
            
            <div class="seo-autofix-grid">
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Skip Link</h3>
                    <p><label><input type="checkbox" name="enable_skip_link" <?php checked(!empty($settings['enable_skip_link'])); ?>> Enable skip navigation link</label></p>
                    <table class="form-table">
                        <tr>
                            <th>Skip Link Text</th>
                            <td><input type="text" name="skip_link_text" value="<?php echo esc_attr($settings['skip_link_text'] ?? 'Skip to main content'); ?>"></td>
                        </tr>
                        <tr>
                            <th>Target ID</th>
                            <td><input type="text" name="skip_link_target" value="<?php echo esc_attr($settings['skip_link_target'] ?? 'main-content'); ?>"></td>
                        </tr>
                    </table>
                </div>
                
                <div class="seo-autofix-card">
                    <h3 style="margin-top:0;">Focus Indicators</h3>
                    <p><label><input type="checkbox" name="enable_focus_styles" <?php checked(!empty($settings['enable_focus_styles'])); ?>> Enable visible focus indicators</label></p>
                    <table class="form-table">
                        <tr>
                            <th>Outline Color</th>
                            <td><input type="color" name="focus_outline_color" value="<?php echo esc_attr($settings['focus_outline_color'] ?? '#005fcc'); ?>"></td>
                        </tr>
                        <tr>
                            <th>Outline Width</th>
                            <td><input type="text" name="focus_outline_width" value="<?php echo esc_attr($settings['focus_outline_width'] ?? '3px'); ?>" style="width:80px;"></td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="seo-autofix-card">
                <h3 style="margin-top:0;">External Link Warnings</h3>
                <p><label><input type="checkbox" name="add_link_warnings" <?php checked(!empty($settings['add_link_warnings'])); ?>> Enable link warnings for new tabs</label></p>
                <p><label><input type="checkbox" name="link_aria_labels" <?php checked(!empty($settings['link_aria_labels'])); ?>> Add aria-labels to external links</label></p>
                <p><label><input type="checkbox" name="link_visual_indicator" <?php checked(!empty($settings['link_visual_indicator'])); ?>> Add visual indicator (↗)</label></p>
                <p>Indicator text: <input type="text" name="link_indicator_text" value="<?php echo esc_attr($settings['link_indicator_text'] ?? '(opens in new tab)'); ?>"></p>
                
                <p><button type="submit" name="save_a11y" class="button button-primary">Save Accessibility Settings</button></p>
            </div>
        </form>
    </div>
    <?php
}

// ==================== ANALYTICS PAGE ====================
function seo_autofix_analytics_page() {
    $settings = get_option('seo_autofix_settings', array());
    
    if (isset($_POST['save_analytics']) && check_admin_referer('seo_autofix_analytics')) {
        $settings['ga4_id'] = sanitize_text_field($_POST['ga4_id']);
        $settings['gtm_id'] = sanitize_text_field($_POST['gtm_id']);
        $settings['fb_pixel_id'] = sanitize_text_field($_POST['fb_pixel_id']);
        
        update_option('seo_autofix_settings', $settings);
        echo '<div class="notice notice-success"><p>Analytics settings saved!</p></div>';
    }
    ?>
    <div class="wrap seo-autofix-wrap">
        <h1><span class="dashicons dashicons-chart-bar"></span> Analytics & Tracking</h1>
        
        <form method="post">
            <?php wp_nonce_field('seo_autofix_analytics'); ?>
            
            <div class="seo-autofix-card">
                <h3 style="margin-top:0;">Google Analytics 4</h3>
                <table class="form-table">
                    <tr>
                        <th>Measurement ID</th>
                        <td>
                            <input type="text" name="ga4_id" value="<?php echo esc_attr($settings['ga4_id'] ?? ''); ?>" placeholder="G-XXXXXXXXXX" class="regular-text">
                            <p class="description">Find this in GA4 → Admin → Data Streams</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="seo-autofix-card">
                <h3 style="margin-top:0;">Google Tag Manager</h3>
                <table class="form-table">
                    <tr>
                        <th>Container ID</th>
                        <td>
                            <input type="text" name="gtm_id" value="<?php echo esc_attr($settings['gtm_id'] ?? ''); ?>" placeholder="GTM-XXXXXXX" class="regular-text">
                            <p class="description">If you use GTM, you may not need GA4 directly</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="seo-autofix-card">
                <h3 style="margin-top:0;">Facebook Pixel</h3>
                <table class="form-table">
                    <tr>
                        <th>Pixel ID</th>
                        <td>
                            <input type="text" name="fb_pixel_id" value="<?php echo esc_attr($settings['fb_pixel_id'] ?? ''); ?>" placeholder="1234567890" class="regular-text">
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="seo-autofix-card">
                <p><button type="submit" name="save_analytics" class="button button-primary button-hero">Save Analytics Settings</button></p>
            </div>
        </form>
    </div>
    <?php
}
