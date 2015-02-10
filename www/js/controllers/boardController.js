/**
 * Created by rylan on 07/02/15.
 * Board Controller is responsible for everything related to another users board.
 * The current board being viewed is set in the friends controller, in viewPosts() using UserStateService.setCurrentTag(tag);
 */
angular.module('board.controller', [])


    .controller('boardCtrl',
    function boardCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $cordovaToast, $ionicViewService,
                       PostService, BoardService, UserStateService, AuthenticationService, $cordovaCamera, $ionicLoading, localstorage) {


        $scope.modal = {};
        if (AuthenticationService.isLogged) {
            serviceUpdate(0);


            $scope.username = localstorage.get("username", 0);

             //Mandatory services update


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
                    // An error occured. Show a the user a failer img?
                });
            }

            $ionicModal.fromTemplateUrl('templates/modals/addPost.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal.addPost = modal;
            });

            // Open the addpost modal
            $scope.addPost = function () {
                $scope.modal.addPost.show();

            };

            if(UserStateService.getReply() ){
                $timeout(function(){
                    $scope.addPost();
                    UserStateService.setReply(false);
                }, 300);

            }

            $scope.addPostData = {};
            $scope.addBoardData = {};
            $scope.addBoardData.boardTag = UserStateService.getCurrentTag();

            $scope.doAddPost = function () {
                $scope.showLoading();
                var newPostData = {
                    content: $scope.addPostData.content,
                    privacyLevel: $scope.addPostData.privacyLevel,
                    timeout: $scope.addPostData.timeout,
                    tag: $scope.addBoardData.boardTag,
                    img: $scope.imgURI
                };

                PostService.addPost(newPostData, localstorage.get("token", 0)).success(function (data, status, headers, config) {//Save new post
                    $scope.closeAddPost();
                    $scope.hideLoading();
                    $scope.fromServer = data.message;
                   // serviceUpdate(); //update view for real time'nesss!
                   
                }).error(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                });

                $timeout(function () {
                    $scope.closeAddPost();
                }, 20000);
            };

            // Close open add post modal
            $scope.closeAddPost = function () {
                $scope.modal.addPost.hide();
            };


        }

        $scope.addPostData.timeout = 1;
        $scope.addPostData.privacyLevel = "Private";



        function serviceUpdate(timestamp) {
            var timestamp = timestamp;
            //Update the board currently being viewed, UserStateService supplies us with the current tag we are on.
            //UserStateService does is not concered with the my board tag.
            BoardService.getBoardByTag(UserStateService.getCurrentTag(), timestamp, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                $timeout(function () {
                    if(data.posts) {
                        // Setting the client side timeout for each post.
                        data.posts.forEach(function (post) {
                            post.visible = true;
                            post.counter = Math.floor((post.dateCreated + post.timeout - Date.now()) / 1000);
                            post.onTimeout = function () {
                                post.counter--;
                                if (post.counter > 0) {
                                    posttimeout = $timeout(post.onTimeout, 1000);
                                } else {
                                    console.log('time up');
                                    post.visible = false;
                                    post = null;
                                }
                            };
                            var posttimeout = $timeout(post.onTimeout, 1000);
                        });
                        timestamp = data.timestamp;
                        console.log(data.posts);
                        $scope.posts = data.posts;
                        $timeout(function () {
                            console.log(timestamp);
                            serviceUpdate(timestamp);
                        }, 1000);

                    }

                });
            }).error(function (data, status, headers, config) {
                $timeout(function () {
                    console.log(timestamp);
                    serviceUpdate(timestamp);
                }, 1000);
                console.log(data.message);
            });
        }



        $scope.showLoading = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        /**
         * hide loading animation
         */
        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };


    });

