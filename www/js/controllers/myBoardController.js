/**
 * Created by rylan on 07/02/15.
 * myBoard Controller is responsible for the following.
 * Deleting/Creating posts and updating posts on myBoard
 */
angular.module('myBoard.controller', [])

    .controller('myBoardCtrl',
    function myBoardCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicViewService,
                         $cordovaToast, BoardService, PostService, AuthenticationService, localstorage, $cordovaCamera) {

        if (AuthenticationService.isLogged) {
            $scope.modal = {};
            $scope.username = localstorage.get("username", 0);
            serviceUpdate();


            
         
            //Having trouble turning into a service.
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

            $ionicModal.fromTemplateUrl('templates/modals/addPost.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal.addPost = modal;
            });

            // Open the addpost modal
            $scope.addPost = function () {
                $scope.modal.addPost.show();

            };

            $scope.addPostData = {};
            $scope.addBoardData = {};

            $scope.fillTagField = function () {
                $scope.addBoardData.boardTag = localStorage.username + "'s Board";
            }

            $scope.doAddPost = function () {
                var newPostData = {
                    content: $scope.addPostData.content,
                    privacyLevel: $scope.addPostData.privacyLevel,
                    timeout: $scope.addPostData.timeout,
                    tag: $scope.addBoardData.boardTag,
                    img: $scope.imgURI
                };

                PostService.addPost(newPostData, localstorage.get("token", 0)).success(function (data, status, headers, config) {
                    $scope.fromServer = data.message;
                    serviceUpdate();

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

        $scope.deletePost = function (id, posts) {
            for (i = 0; i < posts.length; i++) {
                if (posts[i]._id === id) {
                    posts.splice(i, 1);
                    $scope.myPosts = posts;
                }
                PostService.deletePost(id, localstorage.get("token", 0)).success(function () {
                    console.log("removed");
                }).error(function () {
                    console.log("not removed!");
                });
            }
        };

        function serviceUpdate() {
            BoardService.getMyBoard(localstorage.get("token", 0)).success(function (data, status, headers, config) {
                $timeout(function () {

                    // Setting the client side timeout for each post.
                    data.forEach(function (post) {
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
                    $scope.myPosts = data;
                });


            }).error(function (data, status, headers, config) {
                alert(data.message);
            });
        }

    });
