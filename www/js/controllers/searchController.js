/**
 * Created by rylan on 07/02/15.
 * Search Controller is responsible for the following.
 * Display all the users in the database as well giving us the ability to send those users friend requests.
 */
angular.module('search.controller', [])

    .controller('searchCtrl',
    function searchCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                        BoardService, PostService, UserDataService, AuthenticationService) {


        $scope.modal = {};
        if (AuthenticationService.isLogged) {
            $scope.username = localStorage.username;
            serviceUpdate();

            $scope.addFriend = function (friendname) {
                var newFriendData = {
                    friendusername: friendname
                };
                UserDataService.sendFriendRequest(newFriendData, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    alert(data.message);
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
            }

            function serviceUpdate(){
                UserDataService.getAllUsers(localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.users = data;
                    });
                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
            }

        }

    });
