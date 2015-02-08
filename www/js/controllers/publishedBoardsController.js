
/**
 * Created by rylan on 07/02/15.
 * Published Boards Controller is responsible for the following.
 * Updating the published boards view, as well as viewing published boards.
 */
angular.module('publishedBoards.controller', [])

    .controller('publishedCtrl',
    function publishedBoardsCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                        BoardService, AuthenticationService) {


        if (AuthenticationService.isLogged) {
            $scope.username = localStorage.username;
            serviceUpdate();

        }

        $scope.viewBoard = function (tag) { //view a published board, could be your own. Shouldn't be though.

            $location.path("/app/viewposts");
            UserStateService.setCurrentTag(tag);

            BoardService.getBoardByTag(tag, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                $scope.posts = data;
            }).error(function (data, status, headers, config) {
                console.log(data.message);
            });

        }

        function serviceUpdate() {
            BoardService.getPublishedBoards(localstorage.get("token", 0)).success(function (data, status, headers, config) {
                $timeout(function () {
                    $scope.boards = data;
                });

            }).error(function (data, status, headers, config) {
                alert(data.message);
            });


        }
    }
);


