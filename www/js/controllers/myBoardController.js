/**
 * Created by rylan on 07/02/15.
 * myBoard Controller is responsible for the following.
 * Deleting/Creating posts and updating posts on myBoard
 */
angular.module('myBoard.controller', [])

    .controller('myBoardCtrl',
    function myBoardCtrl($scope, $location, $window, $timeout, $interval, $ionicModal, $ionicLoading, $ionicViewService,
                         $cordovaToast, BoardService, PostService, AuthenticationService, localstorage, $cordovaCamera, UserStateService) {

        if (AuthenticationService.isLogged) {
            $scope.modal = {};
            $scope.username = localstorage.get("username", 0);

            serviceUpdate();

            // set the current view
            UserStateService.setCurrentTag(localStorage.username + "\'s Board");
            $scope.$on('updateMyBoard', function(event, payload) { serviceUpdate(); }); //Listen for gcm updates

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
            };

            /**
             * Load the addPost modal
             */
            $ionicModal.fromTemplateUrl('templates/modals/addPost.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal.addPost = modal;
            });

            /**
             * Open the addPost Modal
             */
            $scope.addPost = function () {
                $scope.modal.addPost.show();

            };

            /**
             * Blank objs to be filled in by user
             * @type {{}}
             */
            $scope.addPostData = {};
            $scope.addBoardData = {};

            /**
             * Assemble the data inputted and send to the PostService for saving
             */
            $scope.doAddPost = function () {
                $scope.showLoading();
                var newPostData = {
                    content: $scope.addPostData.content,
                    privacyLevel: $scope.addPostData.privacyLevel,
                    timeout: $scope.addPostData.timeout,
                    tag: UserStateService.getCurrentTag(),
                    img: $scope.imgURI
                };

                PostService.addPost(newPostData)
                    .success(function (data, status, headers, config) {
                        $scope.closeAddPost();
                        $scope.hideLoading();
                        $scope.fromServer = data.message;
                        serviceUpdate();
                        BoardService.getBoardByTag($scope.polingTag)
                            .success(function (data, status, headers, config) {
                                $scope.posts = data;
                            })
                            .error(function (data, status, headers, config) {
                                console.log(data.message);
                            });
                    })
                    .error(function (data, status, headers, config) {
                        $scope.hideLoading();
                        $scope.fromServer = data.message;
                    });
            };

            // Close open add post modal
            $scope.closeAddPost = function () {
                $scope.modal.addPost.hide();
            };

        }

        /**
         * Shows an 'Action sheet' (slide up menu)
         * when a post is clicked.
         */
        $scope.showPostActions = function(id, owner) {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                titleText: 'Post Options',
                buttons: [
                    { text: 'Reply' },
                ],
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            UserStateService.setCurrentTag(owner + '\'s Board');
                            $location.path("/app/viewposts");
                            break;
                    }
                    return true;
                },
                destructiveButtonClicked: function() {
                    $scope.deletePost(id);
                    hideSheet();
                }
            });
        };

        /**
         * Loop through the posts, find the given id and
         * use the PostService to delete the post.
         * @param id
         * @param posts
         */
        $scope.deletePost = function (id) {
            for (i = 0; i < $scope.myPosts.length; i++) {
                if ($scope.myPosts[i]._id === id) {
                    $scope.myPosts.splice(i, 1);
                }
                PostService.deletePost(id).success(function () {
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

        /**
         * Show loading animation & block user input
         */
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
