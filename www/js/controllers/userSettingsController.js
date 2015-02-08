/**
 * Created by rylan on 07/02/15.
 * User Settings controller. Handles everything related to
 * controlling profile image, name, email, delete acct, maximum post time on board
 */
angular.module('userSettings.controller', [])

    .controller('userSettingsCtrl',
    function userSettingsCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                        BoardService, PostService, UserDataService, AuthenticationService, localstorage, $cordovaCamera, $ionicPopup) {


        $scope.modal = {};
        if (AuthenticationService.isLogged) {

            $scope.updateData = {};

            $scope.username = localStorage.username;
            serviceUpdate();

            $scope.takePicture = function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.updateData.imgURI = "data:image/jpeg;base64," + imageData;
                    console.log($scope.updateData.imgURI);
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            }



            $scope.deleteAccount = function(){
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete your account',
                    template: 'Are you sure you want to delete your account?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        UserDataService.deleteUser(localstorage.get("token", 0)).success(function(){
                            localStorage.clear();
                            $location.path("/init/login");
                        }).error();
                    }
                });
            }


            $scope.updateAccount = function(){


                if($scope.updateData.username !== "" && $scope.updateData.username !== undefined){
                    var newUsername = {
                        username : $scope.updateData.username
                    };
                    UserDataService.updateUsername(newUsername, localstorage.get("token", 0)).success(function(data){
                        localstorage.set("token", data.token);
                        localstorage.set("username", data.username);
                        alert("Username Updated to: " + data.username);
                    }).error(function(){
                        alert("Unable to update username");
                    });
                }

                if($scope.updateData.email !== "" && $scope.updateData.email !== undefined){
                    var newEmail = {
                        email : $scope.updateData.email
                    };
                    UserDataService.updateEmail(newEmail, localstorage.get("token", 0)).success(function(data){

                        alert("Email Updated to: " + data.email);
                    }).error(function(){
                        alert("Unable to update email");
                    });
                }

                if($scope.updateData.maxTTL !== "" && $scope.updateData.maxTTL !== undefined){
                    var newMaxTTL = {
                        maxTTL : $scope.updateData.maxTTL
                    };
                    UserDataService.updateMaxPostTime(newMaxTTL, localstorage.get("token", 0)).success(function(data){
                        alert("maxTTL Updated to: " + data.maxTTL);
                    }).error(function(){
                        alert("Unable to update maxTTL");
                    });
                }

                if($scope.updateData.imgURI !== "" && $scope.updateData.imgURI !== undefined){
                    var newImg = {
                        img : $scope.updateData.imgURI
                    };
                    UserDataService.updateProfileImg(newImg, localstorage.get("token", 0)).success(function(data){
                        alert("Profile Image updated");
                    }).error(function(){
                        alert("Unable to update Profile Image");
                    });
                }

                if($scope.updateData.newPassword !== "" && $scope.updateData.newPassword !== undefined  && $scope.updateData.oldPassword !== "" && $scope.updateData.oldPassword !== undefined){
                    var passInfo = {
                        oldpassword : $scope.updateData.oldPassword,
                        newpassword : $scope.updateData.newPassword
                    };
                    UserDataService.updatePassword(passInfo, localstorage.get("token", 0)).success(function(data){
                        alert("Password updated");
                    }).error(function(){
                        alert("Unable to update password");
                    });
                }
            }



            }





        function serviceUpdate(){
            UserDataService.getUserInfo(localstorage.get("token", 0)).success(function(user){
                if(user){
                    $scope.updateData.firstName = user.firstname;
                    $scope.updateData.lastName = user.lastname;
                    $scope.updateData.username = user.username;
                    $scope.updateData.email = user.email;
                    $scope.updateData.maxTTL = user.maxTTL;
                    $scope.updateData.imgURI = user.profileImage;
                }
            }).error(function(){

            });
        }





    });

