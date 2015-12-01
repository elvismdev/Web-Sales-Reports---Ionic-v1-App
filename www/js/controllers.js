angular.module('wooshop.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, wooFactory, $q) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})




.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
  { title: 'Reggae', id: 1 },
  { title: 'Chill', id: 2 },
  { title: 'Dubstep', id: 3 },
  { title: 'Indie', id: 4 },
  { title: 'Rap', id: 5 },
  { title: 'Cowbell', id: 6 }
  ];
})





.controller('TopSellersCtrl', function($scope, wooFactory, $q) {

  $scope.topSoldItems = [];
  $scope.gcTopSoldItems = [];

  $q.all([
    wooFactory.gctvGetTopSellers(),
    wooFactory.gcGetTopSellers()
    ]).then( function( response ) {

      wooFactory.hideLoader();

      $scope.topSoldItems = response[0];
      $scope.gcTopSoldItems = response[1];

      var now = new Date();
      $scope.$root.now = now.toTimeString();

    });

    $scope.storeName = function () {
      return store.name;
    };

    $scope.gcStoreName = function () {
      return gcStore.name;
    };

    $scope.doRefresh = function() {

      $q.all([
        wooFactory.gctvGetTopSellers(),
        wooFactory.gcGetTopSellers()
        ]).then( function( response ) {

          $scope.topSoldItems = response[0];
          $scope.gcTopSoldItems = response[1];

          var now = new Date();
          $scope.$root.now = now.toTimeString();

          $scope.$broadcast('scroll.refreshComplete');

        });

      };

    })

.controller('WooShopAppCtrl', function($scope, wooFactory, $q) {

  $scope.storeResult = 0;
  $scope.gcStoreResult = 0;

  $q.all([
    wooFactory.gctvGetDaySales(),
    wooFactory.gcGetDaySales()
    ]).then( function( response ) {

      wooFactory.hideLoader();

      $scope.storeResult = response[0];
      $scope.gcStoreResult = response[1];

      var now = new Date();
      $scope.$root.now = now.toTimeString();

    });

    $scope.storeName = function () {
      return store.name;
    };

    $scope.gcStoreName = function () {
      return gcStore.name;
    };

    $scope.total = function () {
      return $scope.storeResult + $scope.gcStoreResult;
    };


    $scope.doRefresh = function() {

      $q.all([
        wooFactory.gctvGetDaySales(),
        wooFactory.gcGetDaySales()
        ]).then( function( response ) {

          $scope.storeResult = response[0];
          $scope.gcStoreResult = response[1];

          var now = new Date();
          $scope.$root.now = now.toTimeString();

          $scope.$broadcast('scroll.refreshComplete');
        });

      };


    })






.controller('StoreCtrl', function($scope, $ionicModal, $ionicPlatform, wooFactory, $stateParams) {

  $ionicPlatform.ready(function() {

        // Initialize the database.
        wooFactory.initDB();

        // Get all store records from the database.
        wooFactory.getAllStores()
        .then(function (stores) {
          $scope.stores = stores;
        });
      });


    // Initialize the modal view.
    $ionicModal.fromTemplateUrl('templates/addstoremodal.html', {
      scope: $scope
    }).then(function(modal) {

      $scope.modal = modal;

      if ( $scope.stores.length <= 0 )
        $scope.showAddStoreModal();

    });


    $scope.showAddStoreModal = function() {
      $scope.store = {};
      $scope.action = 'Add';
      $scope.isAdd = true;
      $scope.modal.show();
    };

    $scope.showEditStoreModal = function(store) {
      $scope.store = store;
      $scope.action = 'Edit';
      $scope.isAdd = false;
      $scope.modal.show();
    };

    $scope.saveStore = function() {

      // $scope.submitted = true;

      if ($scope.isAdd) {
        wooFactory.addStore($scope.store);
      } else {
        wooFactory.updateStore($scope.store);
      }
      $scope.modal.hide();

    };

    $scope.deleteStore = function() {
      wooFactory.deleteStore($scope.store);
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });


  });
