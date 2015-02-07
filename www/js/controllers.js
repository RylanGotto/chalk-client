

angular.module('main.controllers', [])

    .controller('InitCtrl', ['$scope', '$location', '$window', '$timeout', '$ionicModal', '$ionicViewService', '$cordovaToast', 'UserLoginService', 'AuthenticationService', 'RegistrationService', '$cordovaCamera',
        function InitCtrl($scope, $location, $window, $timeout, $ionicModal, $ionicViewService, $cordovaToast, UserLoginService, AuthenticationService, RegistrationService, $cordovaCamera) {
            $scope.modal = {};
            $scope.regData = {};


            $ionicModal.fromTemplateUrl('templates/modals/register.html', {
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
                    email: $scope.regData.email,
                    img: $scope.imgURI
                };
                console.log(1);
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




            $scope.doLogin = function(username, password) {
                if (username !== undefined && password !== undefined) {

                    UserLoginService.logIn(username, password).success(function (data) {
                        AuthenticationService.isLogged = true;
                        localStorage.username = data.usr.username;
                        localStorage.userid = data.usr._id;
                        localStorage.token = data.tok;
                        console.log(data.tok);
                        $scope.fromServer = "Welcome, " + data.usr.username;

                    }).error(function (status, data) {
                        $scope.fromServer = data.message;
                    });
                    $timeout(function () {
                        $scope.closeLogin();
                        $ionicViewService.nextViewOptions({
                            disableBack: true
                        });
                        if(AuthenticationService.isLogged){
                            $location.path('/app/myBoard');
                        }
                    }, 2500);
                }
            }

            $scope.takePicture = function() {
                var options = {
                    quality : 75,
                    destinationType : Camera.DestinationType.DATA_URL,
                    sourceType : Camera.PictureSourceType.CAMERA,
                    allowEdit : true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }



            $ionicModal.fromTemplateUrl('templates/modals/login.html', {
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
    function AppCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService, $cordovaToast, BoardService, PostService, UserDataService, AuthenticationService, $cordovaPush, $cordovaDevice, $cordovaDialogs, $cordovaMedia, $cordovaToast, ionPlatform, $state, $http, $cordovaCamera) {

        if(AuthenticationService.isLogged) {
            $scope.notifications = [];

            // call to register automatically upon device ready
            ionPlatform.ready.then(function (device) {
                $scope.register();
               serviceUpdate();
            });
            serviceUpdate();
            $scope.newActivity = 0;


            $scope.takePicture = function() {
                var options = {
                    quality : 75,
                    destinationType : Camera.DestinationType.DATA_URL,
                    sourceType : Camera.PictureSourceType.CAMERA,
                    allowEdit : true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }


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


                    //$cordovaToast.showShortCenter('Registered for push notifications');
                    $scope.registerDisabled = true;
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
                    $timeout(function () {
                        $scope.notifications.push(JSON.stringify(notification.alert));
                    })
                }
            });

            function gcmHandler(payload) {
                   serviceUpdate();

                switch (payload.type) {
                    case "0": //new post on myBoard
                        if ($state.current.url === "/myBoard") {

                            $cordovaToast.showShortCenter('New Post!');

                        } else {
                            $location.path("/app/myboard");
                            $ionicViewService.nextViewOptions({
                                disableBack: true
                            });

                        }
                        break;
                    case "1": //friend has accpeted friend request
                        $timeout(function () {
                            $scope.newFriendCount = $scope.newFriendCount + 1;
                        });
                        break;
                    case "2":
                        if ($state.current.url === "/viewfriends") {
                            $cordovaToast.showShortBottom(payload.username + ' sent a friend request');

                        } else {
                            $timeout(function () {
                                $scope.newFriendCount = $scope.newFriendCount + 1;
                            });
                        }
                        $timeout(function () {
                            $scope.showNewFriendDiv = true;
                            $scope.requester = payload.username;
                        });

                        break;
                    default:
                        break;
                }
            }

            // Android Notification Received Handler
            function handleAndroid(notification) {
                // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
                //             via the console fields as shown.
                if (AuthenticationService.isLogged) {
                    console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
                    console.log(notification);
                    if (notification.event == "registered") {
                        $scope.regId = notification.regid;
                        console.log('device id ' + notification.regid)
                        storeDeviceToken("android");
                    }
                    else if (notification.event == "message") {
                        gcmHandler(notification.payload);

                    }
                    else if (notification.event == "error")
                        $cordovaDialogs.alert(notification.msg, "Push notification error event");
                    else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
                }
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

            // Stores the device token in a db using chalkserver (running locally in this case)
            //
            // type:  Platform type (ios, android etc)
            function storeDeviceToken(type) {
                console.log("Reached store device");
                // Create a random userid to store with it
                console.log($scope.username);
                var user = {user: $scope.username, type: type, token: $scope.regId};
                console.log("Post token for registered device with data " + JSON.stringify(user));
                $http.defaults.headers.common['x-auth'] = localStorage.token;
                $http.post("https://mighty-fortress-8853.herokuapp.com/api/push/subscribe", JSON.stringify(user))
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
                $http.post("https://mighty-fortress-8853.herokuapp.com/api/push/unsubscribe", JSON.stringify(tkn))
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
                $scope.registerDisabled = false;
                //need to define options here, not sure what that needs to be but this is not recommended anyway
//        $cordovaPush.unregister(options).then(function(result) {
//            console.log("Unregister success " + result);//
//        }, function(err) {
//            console.log("Unregister error " + err)
//        });
            }


            $scope.deletePost = function(id, posts) {
                for (i = 0; i < posts.length; i++) {
                    if(posts[i]._id === id){
                        posts.splice(i, 1);
                        $scope.myPosts = posts;
                    }
                    PostService.deletePost(id).success(function(){
                        console.log("removed");
                    }).error(function(){
                        console.log("not removed!");
                    });
                }
            };

            $scope.logout = function () {
                if (AuthenticationService.isLogged) {
                    AuthenticationService.isLogged = false;
                    delete localStorage.username;
                    delete localStorage.token;
                    delete localStorage.userid;
                    $location.path("/");
                }

            }

            $scope.showNewFriendDiv = false;
            $scope.newFriendCount = 0;
            $scope.newPostCount = 0;
            $scope.modal = {};
            $scope.addBoardData = {};
            $scope.addPostData = {};
            $scope.username = localStorage.username;


            $scope.goMyBoard = function () {
                serviceUpdate();
                $location.path("/app/myBoard");
            }


            $scope.goMyFriends = function () {
                UserDataService.getAllFriends().success(function (data) {
                    $timeout(function () {
                            $scope.newFriendCount = 0;
                            $scope.friends = data;

                        }
                    );
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
                $location.path("/app/viewfriends");
            }


            $scope.fillTagField = function () {
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
                   serviceUpdate();

                }).error(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                });


                $timeout(function () {

                    $scope.closeAddBoard();

                }, 20000);
            };

            $scope.viewBoard = function (tag) { //view a boards posts on click

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
                    tag: $scope.addBoardData.boardTag,
                    img: $scope.imgURI
                };

                PostService.addPost(newPostData).success(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                   serviceUpdate();
                    BoardService.getBoardByTag($scope.polingTag).success(function (data, status, headers, config) {
                        $scope.posts = data;
                    }).error(function (data, status, headers, config) {
                        console.log(data.message);
                    });
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


            $scope.addFriend = function (friendname) {
                var newFriendData = {
                    friendusername: friendname
                };
                UserDataService.sendFriendRequest(newFriendData).success(function (data, status, headers, config) {
                    alert(data.message);
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
            }

            $scope.respondToFR = function(friendRequestID, userChoice){
                var decisionData = {
                    decision: userChoice,
                    friendRequestID: friendRequestID
                }

                UserDataService.respondFriendRequest(decisionData).success(function(){
                    $timeout(function(){
                       serviceUpdate();
                    }, 500);
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
            }



            function serviceUpdate() {
                console.log("ATTEMPTING SERVICE UPDATES");
                BoardService.getMyBoard().success(function (data, status, headers, config) {
                    $timeout(function () {

                        // Setting the client side timeout for each post.
                        data.forEach(function(post) {
                            post.visible = true;
                            post.counter = Math.floor((post.dateCreated + post.timeout - Date.now()) / 1000);
                            post.onTimeout = function(){
                                post.counter--;
                                if( post.counter > 0 ) {
                                    posttimeout = $timeout(post.onTimeout,1000);
                                } else {
                                    console.log('time up');
                                    post.visible = false;
                                    post = null;
                                }
                            };
                            var posttimeout = $timeout(post.onTimeout,1000);
                        });
                        $scope.myPosts = data;
                    });


                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                BoardService.getPublishedBoards().success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.boards = data;
                    });

                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                UserDataService.getAllFriends().success(function (data, status, headers, config) {
                   
                        $scope.friends = data;

                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                UserDataService.getFriendRequest().success(function(data, status, headers, config){
                    $timeout(function () {
                        $scope.friendRequests = data;
                        $scope.newFriendCount = data.length;
                    });

                }).error(function(){
                    console.log(2);
                    alert(data.message);
                });


                UserDataService.getAllUsers().success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.users = data;
                    });
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

            }

        }


    });



