// Store.com
var store = {
    'name': 'MyGCTV.com',
    'http_method': 'https://',
    'domain': 'grantcardonetv.com',
    'version': 'v2',
    'consumer_key': 'ck_b0fd7ac1322e8e23dd0775da34b6e899', // From WP user profile configuration
    'customer_secret': 'cs_fd46d7d0fff710cc0d5f46134cc2cb34', // From WP user profile configuration
    /*'customer_secret': 'cs_fd46d7d0fff710cc0d5f46134cc2cb34' + '&', // From WP user profile configuration (v3) Also change in version and request parameters for v3*/
    'filter': '?filter[created_at_min]=',
    'result': {}
};


// GC.com
var gcStore = {
    'name': 'GC.com',
    'http_method': 'http://',
    'domain': 'www.grantcardone.com',
    'version': 'v2',
    'customer_secret': 'cs_cefb91e1ea19a54a18c085702b0fe8b1', // From WP user profile configuration
    'filter': '?filter[created_at_min]=',
    'oauth': {
        'oauth_consumer_key': 'ck_ac46a54f69559bd03dc5c659f3753bb8', // From WP user profile configuration
        'oauth_nonce': '',
        'oauth_signature_method': 'HMAC-SHA256'
    },
    'result': {}
};

// Test v3 Count Orders <Product ID>
// var singleProduct = {
//     'http_method': 'https://',
//     'domain': 'grantcardonetv.com',
//     'version': 'v3',
//     'consumer_key': 'ck_b0fd7ac1322e8e23dd0775da34b6e899', // From WP user profile configuration
//     'customer_secret': 'cs_fd46d7d0fff710cc0d5f46134cc2cb34', // From WP user profile configuration (v3 + &)
//     'request': '/wc-api/v3/products/50118/orders',
//     'filter': '?filter[created_at_min]=' + date,
//     'result': {}
// };