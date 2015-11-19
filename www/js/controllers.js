angular.module('wooreport.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, wooreportFactory) {

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

  $scope.doRefresh = function() {
    wooreportFactory.requests();
    $scope.$broadcast('scroll.refreshComplete');
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





.controller('PlaylistCtrl', function($scope, $stateParams) {
})





.controller('WooReportAppCtrl', function($scope, $ionicPlatform, wooreportFactory) {

  var store_sales = 0;
  $scope.now = today.toTimeString();
  $scope.store_error = '';

  $ionicPlatform.ready(function() {
    wooreportFactory.requests();
  });

  $scope.storeResult = function () {
    if (store.result.status != 200) {
      if (store.result.response) {
        $scope.store_error = 'Error ocurred: ' + ' ' + store.result.status + ' ' + store.result.response.code + ' ' + store.result.response.message;
        store_sales = 0;
      }
    } else {
      if (store.result.response.sales) {
        $scope.store_error = '';
        store_sales = parseFloat(store.result.response.sales.total_sales);
      } else {
        $scope.store_error = 'Some error ocurred triying to get API info. Check for URL parameters. '  + store.result.response.errors[0].message;
        store_sales = 0;
      }
    }

    return store_sales;
  };

  $scope.singleProduct = function () {
    if (singleProduct.result.status != 200) {
      if (singleProduct.result.response) {
        $scope.singleProduct_error = 'Error ocurred: ' + ' ' + singleProduct.result.status + ' ' + singleProduct.result.response.code + ' ' + singleProduct.result.response.message;
      }
    }
    return singleProduct.hours;
  };

  $scope.storeName = function () {
    return store.name;
  };


})






.controller('StoreCtrl', function($scope, $ionicModal, $ionicPlatform, wooreportFactory, $stateParams) {


  $ionicPlatform.ready(function() {

        // Initialize the database.
        wooreportFactory.initDB();

        // Get all store records from the database.
        wooreportFactory.getAllStores()
        .then(function (stores) {
          $scope.stores = stores;
        });
      });


    // Initialize the modal view.
    $ionicModal.fromTemplateUrl('templates/addstoremodal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
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
      if ($scope.isAdd) {
        wooreportFactory.addStore($scope.store);
      } else {
        wooreportFactory.updateStore($scope.store);
      }
      $scope.modal.hide();
    };

    $scope.deleteStore = function() {
      wooreportFactory.deleteStore($scope.store);
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    // console.log($scope);

  });
