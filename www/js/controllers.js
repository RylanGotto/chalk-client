angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http, $ionicModal, $timeout) {

        // Set up the modal scope
        $scope.modal = {};
        $scope.responseData = {};



        $scope.addMyBoard = function () {
            $scope.addboarddata.boardTag = localStorage.username + "'s Board";
        }
        /**
         * Login modal
         */
            // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal.login = modal;
        });

        // Open the login modal
        $scope.login = function () {
            $scope.modal.login.show();
        };
        // TODO: make the login work.
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            var dataObj = {
                username: $scope.loginData.username,
                password: $scope.loginData.password
            };
            $http.defaults.headers.common['x-auth'] = "";
            var res = $http.post('http://localhost:8080/api/auth/login', dataObj);
            res.success(function (data, status, headers, config) {
                localStorage.jwttoken = data.tok;
                localStorage.username = data.usr.username;
                localStorage.userid = data.usr._id;
                $scope.responseData.fromServer = "Welcome, " + data.usr.username;
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });

            $timeout(function () {
                $scope.closeLogin();

            }, 3000);
        };
        $scope.closeLogin = function () {
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

            $http.defaults.headers.common['x-auth'] = "";
            var res = $http.post('http://localhost:8080/api/auth/register', dataObj);
            res.success(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });


            $timeout(function () {
                $scope.closeReg();
            }, 20000);
        };
        $scope.closeReg = function () {
            $scope.modal.reg.hide();
        };


        /**
         * Add Post
         */
            // addPOst form data
        $scope.addPostData = {};
        $scope.addboarddata = {};

        // Create the addPost modal
        $ionicModal.fromTemplateUrl('templates/addPost.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal.addPost = modal;
        });

        // Open the addpost modal
        $scope.addPost = function () {
            $scope.modal.addPost.show();


        };


        $scope.doAddPost = function () {
            var dataObj = {
                content: $scope.addPostData.content,
                privacyLevel: $scope.addPostData.privacyLevel,
                timeout: $scope.addPostData.timeout,
                tag: $scope.addboarddata.boardTag
            };
            console.log($scope.addPostData.content);

            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.post('http://localhost:8080/api/posts', dataObj);
            res.success(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });

            $timeout(function () {
                $scope.closeAddPost();
            }, 20000);
        };

        // Close open add post modal
        $scope.closeAddPost = function () {
            $scope.modal.addPost.hide();
        };


        /**
         * Add Board
         */
        $ionicModal.fromTemplateUrl('templates/addBoard.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal.addBoard = modal;
        });
        $scope.addBoard = function () {
            $scope.modal.addBoard.show();
        };



        $scope.doAddBoard = function () {

            var dataObj = {
                privacyLevel: $scope.addboarddata.privacyLevel,
                timeout: $scope.addboarddata.timeout,
                tag: $scope.addboarddata.boardTag,
                maxTTL: $scope.addboarddata.maxTTL
            };
            console.log(dataObj);
            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.post('http://localhost:8080/api/boards', dataObj);
            res.success(function (data, status, headers, config) {
               $scope.responseData.fromServer = data.message;
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });


            $timeout(function () {
                $scope.closeAddBoard();

            }, 20000);
        };
        $scope.closeAddBoard = function () {
            $scope.modal.addBoard.hide();
        };


    })
















    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('BoardCtrl', ['$scope', 'Post', function ($scope, Post) {
        $scope.posts = Post.query();
    }]);
