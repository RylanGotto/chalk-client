/**
 * Created by rylan on 07/02/15.
 * Application Controller is responsible for the following.
 * Logging a user out. All menu functionality.
 * Handles all GCM activity, such as incoming push notifications and and un/registering a device for push notifications.
 */
angular.module('app.controller', [])

    .controller('appCtrl',
    function appCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService, $cordovaToast, BoardService,  UserDataService, AuthenticationService, $cordovaPush, $cordovaMedia, ionPlatform, $state, $http, localstorage) {

        if (AuthenticationService.isLogged) {

            $scope.modal = {};
            $scope.username = localstorage.get("username", 0);

            $scope.notifications = [];

            // call to register automatically upon device ready
            ionPlatform.ready.then(function (device) {
                $scope.register(); // This registers a device ID in our chalkserver
            });
            $scope.newActivity = 0;



            $scope.logout = function () { //Set user logged status to false, and delete everything from local storage, then return them to login screen
                if (AuthenticationService.isLogged) {
                    AuthenticationService.isLogged = false;
                    delete localStorage.username;
                    delete localStorage.token;
                    delete localStorage.userid;
                    $location.path("/");
                }

            }


            $scope.goMyBoard = function () {
                $location.path("/app/myBoard");
            }

            $scope.goMyFriends = function () { //Go to friends page
                UserDataService.getAllFriends(localstorage.get("token", 0)).success(function (data) { //Get all friends
                    $timeout(function () {
                            $scope.friends = data;

                        }
                    );
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
                $location.path("/app/viewFriends");
            }





            //Create a new add board modal
            $ionicModal.fromTemplateUrl('templates/modals/addBoard.html', {
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

            $scope.addBoardData = {};

            $scope.doAddBoard = function () {
                var newBoardData = {
                    privacyLevel: $scope.addBoardData.privacyLevel,
                    timeout: $scope.addBoardData.timeout,
                    tag: $scope.addBoardData.boardTag,
                    maxTTL: $scope.addBoardData.maxTTL
                };

                BoardService.addBoard(newBoardData, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $scope.fromServer = data.message;

                }).error(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                });


                $timeout(function () {

                    $scope.closeAddBoard();

                }, 20000);
            };


            // Register
            $scope.register = function () {
                var config = null;

                if (ionic.Platform.isAndroid()) {
                    config = {
                        "senderID": '393267053393'
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

                switch (payload.type) {
                    case "0": //new post on my board
                        $scope.$broadcast('updateMyBoard', ""); //broad cast a newpost and run the related service update
                        $cordovaToast.showShortCenter('New Post!');//if they are show a toast notification
                        if (!$state.current.url === "/myBoard") { //Check if user is currently already on myboard

                            $location.path("/app/myBoard"); //else redirect them to myBoard and remove back button
                            $ionicViewService.nextViewOptions({
                                disableBack: true
                            });

                        }
                        break;
                    case "1": //friend has accpeted friend request



                        break;
                    case "2":
                        $scope.$broadcast('updateFriends', "");
                        $cordovaToast.showShortBottom('You have a friend request');

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
                        var deviceInfo = {type: "android", token: $scope.regId};
                        UserDataService.registerUserDevice(localstorage.get("token", 0), deviceInfo);

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




        }
    });