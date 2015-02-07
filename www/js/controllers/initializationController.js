/**
 * Created by rylan on 07/02/15.
 * Friend Controller is responsible for everything related to logging in a user and register a new user.
 * NO SERVICE UPDATES
 */
angular.module('init.controller', [])

    .controller('initCtrl',
        function ($scope, $location, $window, $timeout, $ionicModal, $ionicViewService,
                  $cordovaToast, UserLoginService, AuthenticationService, RegistrationService,
                  $cordovaCamera) {

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


            $scope.doReg = function () { //Register a user on click

                var dataObj = {
                    username: $scope.regData.username,
                    password: $scope.regData.password,
                    confpass: $scope.regData.confPassword,
                    email: $scope.regData.email,
                    img: $scope.imgURI
                };

                RegistrationService.register(dataObj).success(function (data) {
                    $scope.fromServer = data.message;
                }).error(function (data) {
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


            $scope.doLogin = function (username, password) { //Login a user on click
                if (username !== undefined && password !== undefined) {

                    UserLoginService.logIn(username, password).success(function (data) { //Check to see if username and password are valid
                        AuthenticationService.isLogged = true;//if valid set user id, username, and json web token to localStorage
                        localStorage.username = data.usr.username;//Then welcome the user
                        localStorage.userid = data.usr._id;
                        localStorage.token = data.tok;
                        $scope.fromServer = "Welcome, " + data.usr.username;

                    }).error(function (status, data) {
                        $scope.fromServer = data.message;
                    });
                    $timeout(function () { //after 2.5 seconds close login modal, and if logged in redirect user to their Board
                        $scope.closeLogin();
                        $ionicViewService.nextViewOptions({
                            disableBack: true
                        });
                        if (AuthenticationService.isLogged) {
                            $location.path('/app/myBoard');
                        }
                    }, 2500);
                }
            }

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
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                }, function (err) {
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


    );
