/**
 * Created by rylan on 07/02/15.
 * Search Controller is responsible for the following.
 * Display all the users in the database as well giving us the ability to send those users friend requests.
 */
angular.module('search.controller', [])

    .controller('searchCtrl',
    function searchCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                        BoardService, PostService, UserStateService, UserDataService, AuthenticationService, localstorage) {


        $scope.modal = {};
        if (AuthenticationService.isLogged) {
            serviceUpdate();




            $scope.viewBoard = function (tag) { //view a friends board posts on click

                $location.path("/app/viewposts");
                UserStateService.setCurrentTag(tag);

                BoardService.getBoardByTag(tag, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $scope.posts = data;
                }).error(function (data, status, headers, config) {
                    console.log(data.message);
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
