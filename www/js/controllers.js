angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $location, $http, $ionicViewService, $ionicModal, $timeout, Users, Post, Board, Friends) {

        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

        // data
        $scope.modal = {};
        $scope.boardData = {};
        $scope.addPostData = {};
        $scope.addboarddata = {};
        $scope.responseData = {};
        $scope.loginData = {};
        $scope.regData = {}








        //Utilites
        $scope.posts = Post.query();  //populate posts on myBoard.
        $scope.users = Users.query(); //populate users for search.
        $scope.boards = Board.query(); //populate board on published boards page.
        $scope.friends = Friends.charge();
        $scope.loginData.username = localStorage.username;

        $scope.fillTagField = function(){
            $scope.addboarddata.boardTag = localStorage.username + "'s Board";
        }










        $scope.refreshPostsView = function(){ //refresh the board posts view template
            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.get(serverUrl + '/api/boards/' + $scope.addboarddata.boardTag);
            res.success(function (data, status, headers, config) {
               $scope.posts = data;
            });
            res.error(function (data, status, headers, config) {
                $scope.posts = data;
            });
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.refreshPost = function(){ //refresh posts on myboard
            $scope.posts = Post.query(function (){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }


        $scope.refreshBoards = function(){ //refresh published boards
            $scope.boards = Board.query(function (){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.refreshFriendsView = function(){ //refresh published boards
            $scope.friends = Friends.charge(function (){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }


        $scope.viewBoard = function(id, tag){ //view a boards posts on click

            $location.path("/app/viewposts");
            $scope.addboarddata.boardTag = tag;

            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.get(serverUrl + '/api/boards/' + $scope.addboarddata.boardTag);
            res.success(function (data, status, headers, config) {
                $scope.posts = data;
            });
            res.error(function (data, status, headers, config) {
                $scope.posts = data;
            });
        }


        $scope.viewFriendsBoard = function(id, tag){ //view a boards posts on click
            alert(id + tag);
            $location.path("/app/viewposts");
            $scope.addboarddata.boardTag = tag + "'s Board";
            $scope.addboarddata.id = id;

            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.get(serverUrl + '/api/boards/' + $scope.addboarddata.boardTag);
            res.success(function (data, status, headers, config) {
                $scope.posts = data;
            });
            res.error(function (data, status, headers, config) {
                $scope.posts = data;
            });
        }


        /**
         * Login modal
         */
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

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('begin login');
            var dataObj = {
                username: $scope.loginData.username,
                password: $scope.loginData.password
            };
            $http.defaults.headers.common['x-auth'] = "";
            var res = $http.post(serverUrl + '/api/auth/login', dataObj);
            res.success(function (data, status, headers, config) {
                localStorage.jwttoken = data.tok;
                localStorage.username = data.usr.username;
                localStorage.userid = data.usr._id;
                $scope.responseData.fromServer = "Welcome, " + data.usr.username;
                $scope.loginData.username = data.usr.username;

            }).then( function() {
                console.log('after login attempt ' + localStorage.jwttoken);
                $scope.posts = Post.query();
                $scope.closeLogin();
                $ionicViewService.nextViewOptions({
                    disableBack: true
                });
                $location.url('/app/myBoard');
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });

            $timeout(function () {

            }, 3000);
        };

        $scope.closeLogin = function () {
            $scope.modal.login.hide();
        };

        /**
         * Logout
         * Clears the local storage and redirects to base url
         */
        $scope.logout = function() {
            localStorage.clear();
            $location.url('/');
        };

        /**
         * Register
         * Opens register modal
         */
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal.reg = modal;
        });

        $scope.register = function () {
            $scope.modal.reg.show();
        };

        /**
         * Completes the registration with the inputted form data
         * Performs the registration process
         */
        $scope.doReg = function () {

            var dataObj = {
                username: $scope.regData.username,
                password: $scope.regData.password,
                confpass: $scope.regData.confPassword,
                email: $scope.regData.email
            };

            $http.defaults.headers.common['x-auth'] = "";
            var res = $http.post(serverUrl + '/api/auth/register', dataObj);
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

            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.post(serverUrl + '/api/posts', dataObj);
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
            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.post(serverUrl + '/api/boards', dataObj);
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

        /*
         Add friend
         */
        $scope.addFriend = function(id, friendname){
            var dataObj = {
                friendid: id,
                frndname: friendname

            };
            $http.defaults.headers.common['x-auth'] = localStorage.jwttoken;
            var res = $http.put(serverUrl + '/api/users/' + localStorage.userid, dataObj);
            res.success(function (data, status, headers, config) {
                alert(data.message);
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });
        }






    })


    ;
