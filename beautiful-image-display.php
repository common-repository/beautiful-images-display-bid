<?php
/*
* Plugin Name: Beautiful Image Display (BID)
* Plugin URI:  https://iwf1.com/bid-beautiful-image-display-version-2/
* Description: Make images display more beautiful and efficient
* Version:     2.3
* Author:      Liron C (IWF1)
* Author URI:  https://iwf1.com/
* License:     GPL2
* License URI: https://www.gnu.org/licenses/gpl-3.0.html
*/
 
//  Blocking direct access to plugin PHP files for Security reasons
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

$bid_color = esc_attr( get_option('bid_color') );
add_action( 'wp_enqueue_scripts', 'iwf_load_scripts1' );
add_action( 'admin_enqueue_scripts', 'iwf_load_scripts2' );
if ( !function_exists('iwf_load_scripts1') ) {
	 function iwf_load_scripts1() {
                global $bid_color;
                
	 // Javascript
	 	wp_enqueue_script('bid', plugins_url( 'beautiful-image-display.js', __FILE__ ), 'javascript', '', true);
	 	
	 	 wp_localize_script('bid', 'bidColor', $bid_color);
	 	 
	 // CSS
	 	wp_enqueue_style('bid', plugins_url( 'beautiful-image-display.css', __FILE__ ) );
	 }
 }
 
 if ( !function_exists('iwf_load_scripts2') ) {
	 function iwf_load_scripts2() {
	 
	 // CSS
	 	wp_enqueue_style('bid', plugins_url( 'beautiful-image-display.css', __FILE__ ) );
	 }
 }
 
if ( is_admin() ) {
        add_action('admin_menu', 'bid_menu');

        function bid_menu() {
                add_menu_page( "BID Options", "BID", "manage_options", "bid", "bid_fun", "", null );
                add_action( 'admin_init', 'register_bid_setting' );
                function register_bid_setting() {
                        register_setting( 'bid_options', 'bid_color' );
                }
        }

        function bid_fun() { 
                global $bid_color; ?>
            
                <div class="wrap">
                        <h1>BID - Beautiful Image Display</h1>
                        <form method="post" action="options.php"> 
                        <?php settings_fields( 'bid_options' ); 
                        do_settings_sections( 'bid_options' ); ?>
                        <h2>Select Buttons Color:</h2>
                        <div id="bid-colors">
                            <span class="bid-color" id="bid-black" style="background-color:#222;"></span>
                            <span class="bid-color" id="bid-blue" style="background-color:#38c;"></span>
                            <span class="bid-color" id="bid-red" style="background-color:#f33;"></span>
                            <span class="bid-color" id="bid-pink" style="background-color:#ff1493;"></span>
                            <span class="bid-color" id="bid-purple" style="background-color:#9b30ff;"></span>
                        </div>
                        <input type="hidden" id="chosen-c" name="bid_color" value="<?php echo $bid_color; ?>">
                        <?php submit_button(); ?>
                        </form>
                </div>
                    
                <script>
                var colcont =  document.getElementById("bid-colors"),
                colcontchil = [],
                pointElem = null,
                pointer = '';
                insertColor = '',
                pointerOn = '',
                hidFiled = '';
                if (colcont) {
                        hidFiled = document.getElementById("chosen-c");
                        if ( hidFiled.getAttribute("value") ) {
                                pointerOn = hidFiled.getAttribute("value");
                        }
                        for (var i=0; i<colcont.children.length; i++) {
                                colcontchil.push(colcont.children[i]);
                                if (colcontchil[i].getAttribute("style") == pointerOn) {
                                        createPointer();
                                        colcontchil[i].appendChild(pointer);
                                }
                        }
                        colcont.addEventListener("click", function(e) {
                                if (colcontchil.indexOf(e.target) > -1 ) {
                                        if ( document.getElementById("bid-color-pointer") ) {
                                                pointElem = document.getElementById("bid-color-pointer");
                                                pointElem.parentElement.removeChild(pointElem);
                                        }
                                        createPointer();
                                        e.target.appendChild(pointer);
                                        pointElem = document.getElementById("bid-color-pointer");
                                        insertColor = e.target.getAttribute("style");
                                        hidFiled.setAttribute("value", insertColor);
                                }
                        });
                        function createPointer() {
                                pointer = document.createElement("SPAN");
                                pointer.setAttribute("id", "bid-color-pointer");
                        }
                }
                </script>
            
                <p style="font-size: 16px;"><b>Note:</b> although BID is a free and open source plugin, its development and maintanace aren't.<br />In order to keep improving and supporting the plugin please consider <u>purchasing</u> it at one of the symbolic prices below.</p>

                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="WEN96A6GNKT4U">
                <table>
                <tr><td><input type="hidden" name="on0" value="Select A Price">Select A Price</td></tr><tr><td><select name="os0">
                        <option value="1. Pay">1. Pay $5.00 USD</option>
                        <option value="2. Pay">2. Pay $10.00 USD</option>
                        <option value="3. Pay">3. Pay $15.00 USD</option>
                </select> </td></tr>
                </table>
                <input type="hidden" name="currency_code" value="USD">
                <input type="image" src="<?php echo plugin_dir_url( __FILE__ ) . '/buy_with_paypal.jpg'?>" border="0" title="click to purchase" name="submit" alt="Pay with PayPal">
                <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>
                    
    <?php }
} ?>
