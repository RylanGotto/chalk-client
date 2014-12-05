angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

      // Set up the modal scope
      $scope.modal = {};

      /**
       * Login modal
       */
      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal.login = modal;
      });

      // Open the login modal
      $scope.login = function() {
        $scope.modal.login.show();
      };
      // TODO: make the login work.
      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };
      $scope.closeLogin = function() {
        $scope.modal.login.hide();
      };

      /**
       * Add Post Modal
       */
      // addPOst form data
      $scope.addPostData = {};

      // Create the addPost modal
      $ionicModal.fromTemplateUrl('templates/addPost.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal.addPost = modal;
      });

      // Open the addpost modal
      $scope.addPost = function() {
        $scope.modal.addPost.show();
      };

      // TODO: actually add the post.
      $scope.doAddPost = function() {
        console.log('Adding Post: ' + $scope.addPostData);
      };

      /**
       * All Modal Actions
       */
      // Close any open modal
      $scope.closeAddPost = function() {
        $scope.modal.addPost.hide();
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
});
