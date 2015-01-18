

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


    ]) .controller('AppCtrl',
    function AppCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService, $cordovaToast, BoardService, PostService, UserDataService, AuthenticationService, $cordovaPush, $cordovaDevice, $cordovaDialogs, $cordovaMedia, $cordovaToast, ionPlatform) {

        $scope.notifications = [];

        // call to register automatically upon device ready
        ionPlatform.ready.then(function (device) {
            $scope.register();
        });


        // Register
        $scope.register = function () {
            var config = null;

            if (ionic.Platform.isAndroid()) {
                config = {
                    "senderID": '393267053393' // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
                };
            }
            else if (ionic.Platform.isIOS()) {
                config = {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true"
                }
            }

            $cordovaPush.register(config).then(function (result) {


                $cordovaToast.showShortCenter('Registered for push notifications');
                $scope.registerDisabled=true;
                console.log(result);
                // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                if (ionic.Platform.isIOS()) {
                    $scope.regId = result;
                    storeDeviceToken("ios");
                }
            }, function (err) {
                console.log("Register error " + err)
            });
        }

        // Notification Received

        $scope.$on('pushNotificationReceived', function (event, notification) {

            if (ionic.Platform.isAndroid()) {
                console.log('is android');
                handleAndroid(notification);

            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.alert));
                })
            }
        });

        // Android Notification Received Handler
        function handleAndroid(notification) {
            // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
            //             via the console fields as shown.
            if (AuthenticationService.isLogged) {
                console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart)
                console.log(notification);
                if (notification.event == "registered") {
                    $scope.regId = notification.regid;
                    console.log('device id ' + notification.regid)
                    storeDeviceToken("android");
                }
                else if (notification.event == "message") {
                    console.log(notification.message);
                    //$cordovaToast.showShortCenter(notification.message);
                    //$cordovaDialogs.alert(notification.message);
                    $scope.$apply(function () {
                       // $scope.notifications.push(JSON.stringify(notification.message));
                    })
                }
                else if (notification.event == "error")
                    $cordovaDialogs.alert(notification.msg, "Push notification error event");
                else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
            }
        }
        function alertDismissed(){

        }
        // IOS Notification Received Handler
        function handleIOS(notification) {
            // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
            // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
            // the notification when this code runs (weird).
            if (notification.foreground == "1") {
                // Play custom audio if a sound specified.
                if (notification.sound) {
                    var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                    mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
                }

                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

                if (notification.badge) {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                        console.log("Set badge success " + result)
                    }, function (err) {
                        console.log("Set badge error " + err)
                    });
                }
            }
            // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
            // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
            // the data in this situation.
            else {
                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
            }
        }

        // Stores the device token in a db using node-pushserver (running locally in this case)
        //
        // type:  Platform type (ios, android etc)
        function storeDeviceToken(type) {
            console.log("Reached store device");
            // Create a random userid to store with it
            var user = { user: 'user' + Math.floor((Math.random() * 10000000) + 1), type: type, token: $scope.regId };
            console.log("Post token for registered device with data " + JSON.stringify(user));

            $http.post('http://192.168.0.5:8000/subscribe', JSON.stringify(user))
                .success(function (data, status) {
                    console.log("Token stored, device is successfully subscribed to receive push notifications.");
                })
                .error(function (data, status) {
                    console.log("Error storing device token." + data + " " + status)
                }
            );
        }

        // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
        // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
        // time the app opens which this currently does. However in many cases you will always receive the same device token as
        // previously so multiple userids will be created with the same token unless you add code to check).
        function removeDeviceToken() {
            var tkn = {"token": $scope.regId};
            $http.post('http://192.168.0.5:8000/unsubscribe', JSON.stringify(tkn))
                .success(function (data, status) {
                    console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
                })
                .error(function (data, status) {
                    console.log("Error removing device token." + data + " " + status)
                }
            );
        }

        // Unregister - Unregister your device token from APNS or GCM
        // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
        //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
        //
        // ** Instead, just remove the device token from your db and stop sending notifications **
        $scope.unregister = function () {
            console.log("Unregister called");
            removeDeviceToken();
            $scope.registerDisabled=false;
            //need to define options here, not sure what that needs to be but this is not recommended anyway
//        $cordovaPush.unregister(options).then(function(result) {
//            console.log("Unregister success " + result);//
//        }, function(err) {
//            console.log("Unregister error " + err)
//        });
        }


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

    });



