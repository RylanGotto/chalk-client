

angular.module('main.controllers', [])

    .controller('InitCtrl', ['$scope', '$location', '$window', '$timeout', '$ionicModal', '$ionicViewService', '$cordovaToast', 'UserLoginService', 'AuthenticationService', 'RegistrationService',
        function InitCtrl($scope, $location, $window, $timeout, $ionicModal, $ionicViewService, $cordovaToast, UserLoginService, AuthenticationService, RegistrationService) {
            $scope.modal = {};
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
                console.log(dataObj);

                RegistrationService.register(dataObj).success(function(data){
                    $scope.fromServer = data.message;
                }).error(function(data){
                    $scope.fromServer = data.message;
                    console.log(data);
                });


                $timeout(function () {
                    $scope.closeReg();
                }, 20000);
            };

            $scope.closeReg = function () {
                $scope.modal.reg.hide();
            };




            //Admin User Controller (login, logout)
            $scope.doLogin = function(username, password) {
                if (username !== undefined && password !== undefined) {

                    UserLoginService.logIn(username, password).success(function (data) {
                        AuthenticationService.isLogged = true;
                        localStorage.username = data.usr.username;
                        localStorage.userid = data.usr._id;
                        localStorage.token = data.tok;
                        $scope.fromServer = "Welcome, " + data.usr.username;

                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                    $timeout(function () {
                        $scope.closeLogin();
                        $ionicViewService.nextViewOptions({
                            disableBack: true
                        });
                        $location.path('/app/myBoard');
                    }, 3000);
                }
            }





            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal.login = modal;
            });

            $scope.login = function () {
                $scope.modal.login.show();
            };

            $scope.closeLogin = function () {
                $scope.modal.login.hide();
            };

        }


    ]) .controller('AppCtrl', ['$scope', '$location', '$window', '$timeout', '$interval', '$ionicModal', '$ionicViewService', '$cordovaToast', 'BoardService', 'PostService', 'UserDataService', 'AuthenticationService',
        function AppCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService, $cordovaToast, BoardService, PostService, UserDataService, AuthenticationService) {

            $scope.logout = function() {
                if (AuthenticationService.isLogged) {
                    AuthenticationService.isLogged = false;
                    delete localStorage.username;
                    delete localStorage.token;
                    delete localStorage.userid;
                    $location.path("/");
                }

            }

            $scope.modal = {};
            $scope.addBoardData = {};
            $scope.addPostData = {};
            $scope.username = localStorage.username;

            BoardService.getMyBoard().success(function (data, status, headers, config) {
                $scope.myPosts = data;
            }).error(function (data, status, headers, config) {
                alert(data.message);
            });

            BoardService.getPublishedBoards().success(function (data, status, headers, config) {
                $scope.boards = data;
            }).error(function (data, status, headers, config) {
                alert(data.message);
            });

            UserDataService.getAllFriends().success(function (data, status, headers, config) {
                $scope.friends = data;
            }).error(function (data, status, headers, config) {
                alert(data.message);
            });

            UserDataService.getAllUsers().success(function (data, status, headers, config) {
                $scope.users = data;
            }).error(function (data, status, headers, config) {
                alert(data.message);
            });

            $interval(function(){
                BoardService.getMyBoard().success(function (data, status, headers, config) {
                    $scope.myPosts = data;
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
<<<<<<< HEAD
		$location.url('/app/myBoard');
            }, 2000);

 	   $timeout(function () {
		$window.location.reload();
            }, 2000);
	
        };


        $scope.closeLogin = function () {
            $scope.modal.login.hide();
        };

        /**
         * Logout
         */
        $scope.logout = function() {
            localStorage.clear();
            $location.url('/');
        }




=======
>>>>>>> rylan

                BoardService.getPublishedBoards().success(function (data, status, headers, config) {
                    $scope.boards = data;
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                UserDataService.getAllFriends().success(function (data, status, headers, config) {
                    $scope.friends = data;
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                UserDataService.getAllUsers().success(function (data, status, headers, config) {
                    $scope.users = data;
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                BoardService.getBoardByTag($scope.polingTag).success(function (data, status, headers, config) {
                    $scope.posts = data;
                }).error(function (data, status, headers, config) {
                    console.log(data.message);
                });
            }, 10000);

            $scope.fillTagField = function(){
                $scope.addBoardData.boardTag = localStorage.username + "'s Board";
            }


            $ionicModal.fromTemplateUrl('templates/addBoard.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal.addBoard = modal;
            });
            $scope.addBoard = function () {
                $scope.modal.addBoard.show();
            };
            $scope.closeAddBoard = function () {
                $scope.modal.addBoard.hide();
            };


            $scope.doAddBoard = function () {
                var newBoardData = {
                    privacyLevel: $scope.addBoardData.privacyLevel,
                    timeout: $scope.addBoardData.timeout,
                    tag: $scope.addBoardData.boardTag,
                    maxTTL: $scope.addBoardData.maxTTL
                };

                BoardService.addBoard(newBoardData).success(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                }).error(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                });


                $timeout(function () {
                    $scope.closeAddBoard();

                }, 20000);
            };

            $scope.viewBoard = function(id, tag){ //view a boards posts on click

                $location.path("/app/viewposts");
                $scope.addBoardData.boardTag = tag;
                $scope.polingTag = tag;

                BoardService.getBoardByTag(tag).success(function (data, status, headers, config) {
                    $scope.posts = data;
                }).error(function (data, status, headers, config) {
                    console.log(data.message);
                });

            }






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
                var newPostData = {
                    content: $scope.addPostData.content,
                    privacyLevel: $scope.addPostData.privacyLevel,
                    timeout: $scope.addPostData.timeout,
                    tag: $scope.addBoardData.boardTag
                };


                PostService.addPost(newPostData).success(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                }).error(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                });

                $timeout(function () {
                    $scope.closeAddPost();
                }, 20000);
            };

            // Close open add post modal
            $scope.closeAddPost = function () {
                $scope.modal.addPost.hide();
            };


            $scope.addFriend = function(id, friendname){
                var newFriendData = {
                    friendid: id,
                    frndname: friendname

                };
                UserDataService.addFriend(newFriendData).success(function (data, status, headers, config) {
                    alert(data.message);
                }).error(function (data, status, headers, config) {
                      alert(data.message);
                });
            }

        }]);



