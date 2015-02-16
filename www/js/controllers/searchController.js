/**
 * Created by rylan on 07/02/15.
 * Search Controller is responsible for the following.
 * Display all the users in the database as well giving us the ability to send those users friend requests.
 */
angular.module('search.controller', [])

    .controller('searchCtrl',
    function searchCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                        BoardService, PostService, UserStateService, UserDataService, AuthenticationService, localstorage) {



        if (AuthenticationService.isLogged) {
            $scope.modal = {};
            $scope.data = { users:[], boards: [], search: ''};

            $scope.search = function() {
                if($scope.data.search.length != 0 && $scope.data.search.length > 2){//Dont query unless there are three characters match
                    var searchInfo = {searchQuery : $scope.data.search};//search username, firstname, lastname, and board tag for a match
                    UserDataService.search(searchInfo, localstorage.get("token", 0)).success(function(data){
                        $scope.data.users = data.users;
                        $scope.data.boards = data.boards;
                    }).error(function(){
                        $scope.data.users = ['Problems with the server at this time.'];

                    });
                }else{
                    $scope.data.users = [];
                    $scope.data.boards = [];
                }
                

            }


            $scope.viewBoard = function (tag) { //view a users board on click

                $location.path("/app/viewposts");
                UserStateService.setCurrentTag(tag);

                BoardService.getBoardByTag(tag, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $scope.posts = data;
                }).error(function (data, status, headers, config) {
                    console.log(data.message);
                });

            }



        }

    });
