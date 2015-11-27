angular.module('wooshop', ['ionic', 'wooshop.controllers', 'lokijs', 'ngMessages'])

.factory('wooFactory', function($http, $q, Loki, $state) {

  var _db;
  var _stores;


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

  function requests() {

    // Initialize the database.
    // this.initDB();

    // Get all store records from the database.
    // this.getAllStores()
    // .then(function (stores) {

      // if ( stores.length <= 0 ) {
      //   return $state.go( 'app.stores' );
      // }

      // storeID = 0; // This is hardcoded by now, we'll gonna make it later to get this ID dinamically from the request.
      // store.name = stores[storeID].Name;
      // store.domain = stores[storeID].Domain;

      var today = new Date();
      var date = today.getFullYear() + '-' + (parseInt(today.getMonth()) + 1) + '-' + today.getDate();


      gcStore.oauth.oauth_nonce = Math.random().toString(36).slice(2);
      gcStore.oauth.oauth_timestamp = Math.round((today).getTime() / 1000);
      gcStore.filter += date;
      store.filter += date;

      // HTTPS
      $http.get(store.http_method + store.domain + store.request + store.filter, {
        params: {
          'consumer_key': store.consumer_key,
          'consumer_secret': store.customer_secret
        }
      }).success(function (data, status) {
        store.result.response = data;
        store.result.status = status;
      }).error(function (data, status, headers, config) {
        store.result.response = data.errors[0];
        store.result.status = status;
      });


      // GC.com
      // HTTP with OAuth
      $http.get(gcStore.http_method + gcStore.domain + gcStore.request + gcStore.filter, {
        params: {
          'oauth_consumer_key': gcStore.oauth.oauth_consumer_key,
          'oauth_timestamp': gcStore.oauth.oauth_timestamp,
          'oauth_nonce': gcStore.oauth.oauth_nonce,
          'oauth_signature': this.getOauthSignature(gcStore),
          'oauth_signature_method': gcStore.oauth.oauth_signature_method
        }
      }).success(function (data, status) {
        gcStore.result.response = data;
        gcStore.result.status = status;
      }).error(function (data, status, headers, config) {
        gcStore.result.response = data.errors[0];
        gcStore.result.status = status;
      });


      // $http.get(singleProduct.http_method + singleProduct.domain + singleProduct.request + singleProduct.filter, {
            //   params: {
            //     'consumer_key': singleProduct.consumer_key,
            //     'consumer_secret': singleProduct.customer_secret
            //   }
            // }).success(function (data, status) {
            //   singleProduct.result.response = data;
            //   singleProduct.result.status = status;

            //   var orders = data.orders;

            //     // Iterate
            //     var hours = [];
            //     for (var i = 0; i < orders.length; i++) {
            //       var order = orders[i];
            //       var date = new Date(order.created_at);

            //         // Convert 24H format into 12H format
            //         date = date.getHours() > 12 ? date.getHours() - 12 + 'pm' : date.getHours() + 'am';

            //         var exist = false;
            //         for (var x = 0; x < hours.length; x++) {
            //           if (hours[x].label == date) {
            //             hours[x].value++;
            //             exist = true;
            //             break;
            //           }
            //         }

            //         if (exist == false) {
            //           hours.push({
            //             label: date,
            //             value: 1
            //           });
            //         }
            //       }

            //       singleProduct.hours = hours;
            //     }).error(function (data, status, headers, config) {
            //       singleProduct.result.response = data.errors[0];
            //       singleProduct.result.status = status;
            //     });


// });

};

return {
  initDB: initDB,
  getAllStores: getAllStores,
  addStore: addStore,
  updateStore: updateStore,
  deleteStore: deleteStore,
  requests: requests,
  encodeURLCustom: encodeURLCustom,
  getOauthSignature: getOauthSignature
};
})


.config(function($stateProvider, $urlRouterProvider) {

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

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
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
    },
    resolve: {
      check: function(wooFactory) {
        wooFactory.requests();
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
