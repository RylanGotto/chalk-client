angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout) {

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
        $scope.regData.fromServer = "g";
        var dataObj = {
                username: $scope.loginData.username,
                password: $scope.loginData.password,
            };

            var res = $http.post('http://localhost:8080/api/auth/login', dataObj);
            res.success(function (data, status, headers, config) {
                localStorage.jwttoken = data.tok;
                $scope.regData.fromServer = "Welcome, " + data.usr.username;
            });
            res.error(function (data, status, headers, config) {
                $scope.regData.fromServer = data.message;
            });

        $timeout(function() {
          $scope.closeLogin();
          
        }, 3000);
      };
      $scope.closeLogin = function() {
        $scope.modal.login.hide();
      };

      /**
         * Register
         */
        $scope.regData = {};

        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal.reg = modal;
        });
        $scope.register = function () {
            $scope.modal.reg.show();
        };


        $scope.doReg = function () {
            
            var dataObj = {
                username: $scope.regData.username,
                password: $scope.regData.password,
                confpass: $scope.regData.confPassword,
                email: $scope.regData.email
            };

            //REGISTER A NEW USER
            var res = $http.post('http://localhost:8080/api/auth/register', dataObj);
            res.success(function (data, status, headers, config) {
                $scope.regData.fromServer = data.message;
                setTimeout(function(){
                  $scope.regData.fromServer = "gg"
              }, 2000);
            });
            res.error(function (data, status, headers, config) {
                $scope.regData.fromServer = data.message;
            });

                
            $timeout(function () {
                $scope.closeReg();
            }, 20000);
        };
        $scope.closeReg = function () {
            $scope.modal.reg.hide();
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
      // Close open add post modal
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
})

.controller('BoardCtrl', ['$scope', 'Post', function($scope, Post) {
    $scope.posts = Post.query();
}]);
