/**
 * Created by rylan on 07/02/15.
 * User Settings controller. Handles everything related to
 * controlling profile image, name, email, delete acct, maximum post time on board
 */
angular.module('userSettings.controller', [])

    .controller('userSettingsCtrl',
    function userSettingsCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                        BoardService, PostService, UserDataService, AuthenticationService) {


        $scope.modal = {};
        if (AuthenticationService.isLogged) {

            $scope.username = localStorage.username;
            serviceUpdate();

            $scope.updateData = {};
            $scope.updateAccount = function(){


                if($scope.updateData.username !== "" && $scope.updateData.username !== undefined){
                    var newUsername = {
                        username : $scope.updateData.username
                    };
                    console.log(localStorage.token);
                    UserDataService.updateUsername(newUsername).success(function(data){
                        console.log(data.token);
                        localStorage.clear();
                        localStorage.username = data.username;
                        localStorage.token = data.token;
                        alert("Username Updated to: " + data.username);
                    }).error(function(){
                        alert("Unable to update username");
                    });
                }

                if($scope.updateData.email !== "" && $scope.updateData.email !== undefined){
                    var newEmail = {
                        email : $scope.updateData.email
                    };
                    UserDataService.updateEmail(newEmail).success(function(data){

                        alert("Email Updated to: " + data.email);
                    }).error(function(){
                        alert("Unable to update email");
                    });
                }

                if($scope.updateData.maxTTL !== "" && $scope.updateData.maxTTL !== undefined){
                    var newMaxTTL = {
                        maxTTL : $scope.updateData.maxTTL
                    };
                    UserDataService.updateEmail(newMaxTTL).success(function(data){
                        alert("maxTTL Updated to: " + data.maxTTL);
                    }).error(function(){
                        alert("Unable to update maxTTL");
                    });
                }
            }

            if($scope.updateData.imgURI !== "" && $scope.updateData.imgURI !== undefined){
                var newImg = {
                    img : $scope.updateData.imgURI
                };
                UserDataService.updateEmail(newImg).success(function(data){
                    alert("maxTTL Updated to: " + data.imgURI);
                }).error(function(){
                    alert("Unable to update maxTTL");
                });
            }

            }





        function serviceUpdate(){
            UserDataService.getUserInfo().success(function(user){
                if(user){
                    $scope.updateData.username = user.username;
                    $scope.updateData.email = user.email;
                    $scope.updateData.maxTTL = user.maxTTL;
                    $scope.updateData.imgURI = user.img;
                }
            }).error(function(){

            });
        }





    });

