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
            });
            res.error(function (data, status, headers, config) {
                $scope.responseData.fromServer = data.message;
            });

            $timeout(function () {
                $scope.closeLogin();
                $ionicViewService.nextViewOptions({
                    disableBack: true
                });
                $location.url('/app/myBoard');
            }, 3000);
        };

        $scope.closeLogin = function () {
            $scope.modal.login.hide();
        };






        /**
         * Register
         */
        ;

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
    .controller('CordovaCtrl', function($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, ionPlatform, $http) {



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
                    "senderID": "393267053393" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
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
                console.log("Register success " + result);

                $cordovaToast.showShortCenter('Registered for push notifications');
                $scope.registerDisabled=true;
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
            console.log(JSON.stringify([notification]));
            if (ionic.Platform.isAndroid()) {
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
            console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
            if (notification.event == "registered") {
                $scope.regId = notification.regid;
                storeDeviceToken("android");
            }
            else if (notification.event == "message") {
                $cordovaDialogs.alert(notification.message, "Push Notification Received");
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.message));
                })
            }
            else if (notification.event == "error")
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
            else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
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
            // Create a random userid to store with it
            var user = { user: 'user' + Math.floor((Math.random() * 10000000) + 1), type: type, token: $scope.regId };
            console.log("Post token for registered device with data " + JSON.stringify(user));

            $http.post('http://192.168.1.16:8000/subscribe', JSON.stringify(user))
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
            $http.post('http://192.168.1.16:8000/unsubscribe', JSON.stringify(tkn))
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


    });


