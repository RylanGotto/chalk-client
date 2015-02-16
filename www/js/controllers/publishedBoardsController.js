
/**
 * Created by rylan on 07/02/15.
 * Published Boards Controller is responsible for the following.
 * Updating the published boards view, as well as viewing published boards.
 */
angular.module('publishedBoards.controller', [])

    .controller('publishedCtrl',
    function publishedBoardsCtrl($scope, $location, $window, $timeout, $interval, $state, $ionicModal, $ionicViewService,
                        BoardService, AuthenticationService, UserStateService, localstorage) {


        if (AuthenticationService.isLogged) {
            $scope.username = localstorage.get("username", 0);
            serviceUpdate();

        }

        $scope.viewBoard = function (tag) { //view a published board, could be your own. Shouldn't be though.

            $location.path("/app/viewBoard");
            UserStateService.setCurrentTag(tag);

            BoardService.getBoardByTag(tag, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                $scope.posts = data;
            }).error(function (data, status, headers, config) {
                console.log(data.message);
            });

        }

        function serviceUpdate() {
            $scope.data = {};
            console.log($state.current.url);
            if ($state.current.url === "/pubBoards") { //Check if user is currently already on myboard
                console.log("published boards");
                BoardService.getPublishedBoards(localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.boards = data;
                    });

                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });
                UserStateService.setCurrentTag("");
                $scope.data.title = "My Published Boards";
                $scope.data.showDiv = true;
            }else if($state.current.url === "/publicBoards"){
                console.log("public");
                BoardService.getPublicBoards(localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.boards = data;
                    });

                }).error(function (data, status, headers, config) {
                    alert(data.message);
                });

                UserStateService.setCurrentTag("");
                $scope.data.showDiv = false;
                $scope.data.title = "Public Boards";


            }



        }
    }
);


