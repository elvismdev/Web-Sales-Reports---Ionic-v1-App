var today = new Date();
var date = today.getFullYear() + '-' + (parseInt(today.getMonth()) + 1) + '-' + today.getDate();

// Store.com
var store = {
    'http_method': 'https://',
    'domain': 'grantcardonetv.com',
    'version': 'v2',
    'consumer_key': 'ck_b0fd7ac1322e8e23dd0775da34b6e899', // From WP user profile configuration
    'customer_secret': 'cs_fd46d7d0fff710cc0d5f46134cc2cb34', // From WP user profile configuration
    /*'customer_secret': 'cs_fd46d7d0fff710cc0d5f46134cc2cb34' + '&', // From WP user profile configuration (v3) Also change in version and request parameters for v3*/
    'request': '/wc-api/v2/reports/sales',
    'filter': '?filter[created_at_min]=' + date,
    'result': {}
};