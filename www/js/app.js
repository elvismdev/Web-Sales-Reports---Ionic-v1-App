// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.factory('starterFactory', function($http) {
  function requests() {
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


            $http.get(singleProduct.http_method + singleProduct.domain + singleProduct.request + singleProduct.filter, {
              params: {
                'consumer_key': singleProduct.consumer_key,
                'consumer_secret': singleProduct.customer_secret
              }
            }).success(function (data, status) {
              singleProduct.result.response = data;
              singleProduct.result.status = status;

              var orders = data.orders;

                // Iterate
                var hours = [];
                for (var i = 0; i < orders.length; i++) {
                  var order = orders[i];
                  var date = new Date(order.created_at);

                    // Convert 24H format into 12H format
                    date = date.getHours() > 12 ? date.getHours() - 12 + 'pm' : date.getHours() + 'am';

                    var exist = false;
                    for (var x = 0; x < hours.length; x++) {
                      if (hours[x].label == date) {
                        hours[x].value++;
                        exist = true;
                        break;
                      }
                    }

                    if (exist == false) {
                      hours.push({
                        label: date,
                        value: 1
                      });
                    }
                  }

                  singleProduct.hours = hours;
                }).error(function (data, status, headers, config) {
                  singleProduct.result.response = data.errors[0];
                  singleProduct.result.status = status;
                });

              }

              return {
               requests: requests
             };
           })

.run(function($ionicPlatform, starterFactory) {
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
  })
  starterFactory.requests();
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

  .state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlists.html',
        controller: 'PlaylistsCtrl'
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

  .state('app.wooreportapp', {
    url: '/wooreportapp',
    views: {
      'menuContent': {
        templateUrl: 'templates/wooreportapp.html',
        controller: 'WooReportAppCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/wooreportapp');
});
