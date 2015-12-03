angular.module('wooshop', ['ionic', 'wooshop.controllers', 'lokijs', 'ngMessages', 'ionic-native-transitions'])

.constant('WC_API', (function() {

  var base = '/wc-api/v2/';

  return {
    GET_SALES: base + 'reports/sales',
    GET_TOP_SELLERS: base + 'reports/sales/top_sellers'
  }

})())

.factory('wooFactory', function($http, $q, Loki, $state, WC_API, $ionicLoading) {

  var _db;
  var _stores;

  var storeTotal;
  var gcStoreTotal;
  var topSoldItems = [];
  var gcTopSoldItems = [];


  function initDB() {
    var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});
    _db = new Loki('storesDB',
    {
      autosave: true,
      autosaveInterval: 1000, // 1 second
      // adapter: adapter
    });
  };

  function getAllStores() {

    return $q(function (resolve, reject) {

      var options = {
        stores: {
          proto: Object,
          inflate: function (src, dst) {
            var prop;
            for (prop in src) {
              if (prop === 'Date') {
                dst.Date = new Date(src.Date);
              } else {
                dst[prop] = src[prop];
              }
            }
          }
        }
      };

      _db.loadDatabase(options, function () {
        _stores = _db.getCollection('stores');

        if (!_stores) {
          _stores = _db.addCollection('stores');
        }

        resolve(_stores.data);
      });
    });
  };

  function addStore(store) {
    _stores.insert(store);
  };

  function updateStore(store) {
    _stores.update(store);
  };

  function deleteStore(store) {
    _stores.remove(store);
  };


  function encodeURLCustom(params) {
    query_string = Object.keys(params.oauth).map(function (x) {
      return x + '%3D' + params.oauth[x];
    }).join('%26');
    query_string = 'GET&' + params.http_method + params.domain + params.request + params.filter.replace(/&/g, '%26') + '%26' + query_string;

    return query_string
    .replace(/\//g, '%2F')
    .replace(/:/g, '%3A')
    .replace('?', '&')
    .replace(/\[/g, '%255B')
    .replace(/]/g, '%255D')
    .replace(/=/g, '%3D');
  };

  function getOauthSignature(params) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(
      this.encodeURLCustom(params),
      params.customer_secret));
  };



  // MyGCTV.com

  function gctvGetDaySales() {

    return $http.get(store.http_method + store.domain + WC_API.GET_SALES + store.filter, {
      params: {
        'consumer_key': store.consumer_key,
        'consumer_secret': store.customer_secret
      }
    }).then( function(response) {
      storeTotal = parseFloat(response.data.sales.total_sales);
      return storeTotal;
    });

  };

  function gctvGetTopSellers() {

    return $http.get(store.http_method + store.domain + WC_API.GET_TOP_SELLERS + store.filter, {
      params: {
        'consumer_key': store.consumer_key,
        'consumer_secret': store.customer_secret
      }
    }).then(function(response){
      topSoldItems = response.data.top_sellers;
      return topSoldItems;
    });

  };



  // GC.com

  function gcGetTopSellers() {

    var today = new Date();
    var date = today.getFullYear() + '-' + (parseInt(today.getMonth()) + 1) + '-' + today.getDate();

    gcStore.request = WC_API.GET_TOP_SELLERS;

    gcStore.oauth.oauth_nonce = Math.random().toString(36).slice(2);
    gcStore.oauth.oauth_timestamp = Math.round((today).getTime() / 1000);
    gcStore.filter += date;

    return $http.get(gcStore.http_method + gcStore.domain + gcStore.request + gcStore.filter, {
      params: {
        'oauth_consumer_key': gcStore.oauth.oauth_consumer_key,
        'oauth_timestamp': gcStore.oauth.oauth_timestamp,
        'oauth_nonce': gcStore.oauth.oauth_nonce,
        'oauth_signature': this.getOauthSignature(gcStore),
        'oauth_signature_method': gcStore.oauth.oauth_signature_method
      }
    }).then(function(response){
      gcTopSoldItems = response.data.top_sellers;
      return gcTopSoldItems;
    });

  };

  function gcGetDaySales() {

    var today = new Date();
    var date = today.getFullYear() + '-' + (parseInt(today.getMonth()) + 1) + '-' + today.getDate();

    gcStore.request = WC_API.GET_SALES;

    gcStore.oauth.oauth_nonce = Math.random().toString(36).slice(2);
    gcStore.oauth.oauth_timestamp = Math.round((today).getTime() / 1000);
    gcStore.filter += date;

    // GC.com
    // HTTP with OAuth
    return $http.get(gcStore.http_method + gcStore.domain + gcStore.request + gcStore.filter, {
      params: {
        'oauth_consumer_key': gcStore.oauth.oauth_consumer_key,
        'oauth_timestamp': gcStore.oauth.oauth_timestamp,
        'oauth_nonce': gcStore.oauth.oauth_nonce,
        'oauth_signature': this.getOauthSignature(gcStore),
        'oauth_signature_method': gcStore.oauth.oauth_signature_method
      }
    }).then( function(response) {
      gcStoreTotal = parseFloat(response.data.sales.total_sales);
      return gcStoreTotal;
    });

  };

  function showLoader() {
    return $ionicLoading.show({
      template: '<p class="item-icon-left">Fetching Store Data...<ion-spinner icon="lines"/></p>',
      animation: 'fade-in',
      showDelay: 0
    });
  };

  function hideLoader() {
    return $ionicLoading.hide();
  };

  return {
    initDB: initDB,
    getAllStores: getAllStores,
    addStore: addStore,
    updateStore: updateStore,
    deleteStore: deleteStore,
    encodeURLCustom: encodeURLCustom,
    getOauthSignature: getOauthSignature,
    gctvGetDaySales: gctvGetDaySales,
    gcGetDaySales: gcGetDaySales,
    gctvGetTopSellers: gctvGetTopSellers,
    gcGetTopSellers: gcGetTopSellers,
    showLoader: showLoader,
    hideLoader: hideLoader
  };

})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {

  $ionicNativeTransitionsProvider.setDefaultTransition({
    type: 'slide'
  });

  $ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html'
      }
    }
  })

  .state('app.topsellers', {
    url: '/topsellers',
    views: {
      'menuContent': {
        templateUrl: 'templates/topsellers.html',
        controller: 'TopSellersCtrl'
      }
    }
  })

  .state('app.stores', {
    url: '/stores',
    views: {
      'menuContent': {
        templateUrl: 'templates/stores.html',
        controller: 'StoreCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.overview', {
    url: '/overview',
    views: {
      'menuContent': {
        templateUrl: 'templates/overview.html',
        controller: 'WooShopAppCtrl'
      }
    }
  });

  $urlRouterProvider
  .otherwise(function() {
    return '/app/overview';
  });
})

.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if (window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);

  }
  if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
});
