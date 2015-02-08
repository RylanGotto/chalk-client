/**
 * Created by rylan on 07/02/15.
 * Friend Controller is responsible for everything related to viewing a friends board and responding to a friend request.
 * As well as updating all friends and all friend requests.
 */
angular.module('friends.controller', [])

    .controller('friendsCtrl',
    function friendsCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                         BoardService, UserDataService, UserStateService, AuthenticationService, localstorage) {

        if (AuthenticationService.isLogged) {
            $scope.username = localstorage.get("username", 0);
            serviceUpdate(); //Mandatory service update



            $scope.viewBoard = function (tag) { //view a friends board posts on click

                $location.path("/app/viewposts");
                UserStateService.setCurrentTag(tag);

                BoardService.getBoardByTag(tag, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $scope.posts = data;
                }).error(function (data, status, headers, config) {
                    console.log(data.message);
                });

            }

            /**
             * Send a the friend request and decision from user back to server, if accept
             * add eachother to friends lists and delete friendrequest. if decline,
             * send friendrequest id and decision back to server and just delete friend request
             * @param friendRequestID Id of the friend request session
             * @param userChoice true for accept, false for decline friend request
             * */
            $scope.respondToFR = function (friendRequestID, userChoice) {
                var decisionData = {
                    decision: userChoice,
                    friendRequestID: friendRequestID
                }

                UserDataService.respondFriendRequest(decisionData, localstorage.get("token", 0)).success(function () {
                        serviceUpdate();
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
            }


            function serviceUpdate() {

                UserDataService.getAllFriends(localstorage.get("token", 0)).success(function (data, status, headers, config) {

                    $scope.friends = data;

                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                UserDataService.getFriendRequest(localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.friendRequests = data;
                        $scope.newFriendCount = data.length;
                    });

                }).error(function () {
                    console.log(2);
                    alert(data.message);
                });

            }
        }


    });


