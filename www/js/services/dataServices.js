/**
 * Created by rylan on 07/02/15.
 * Data services handle all data related to a user such as, post data, board data, user data.
 */

angular.module('data.services', ['ngResource'])

    .factory('BoardService', function ($http) {
 var serverUrl = "http://localhost:8080";

        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
            addBoard: function(newBoardData){
                return $http.post(serverUrl + '/api/boards', newBoardData);
            },
            getPublishedBoards: function(){
                return $http.get(serverUrl + '/api/boards');
            },
            getMyBoard: function(){
                return $http.get(serverUrl + '/api/myboard');
            },
            getBoardByTag: function(Tag){
                return $http.get(serverUrl + '/api/boards/' + Tag);
            }

        }
    })
    .factory('PostService', function ($http) {
 var serverUrl = "http://localhost:8080";

        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
            addPost: function(newPostData){
                return $http.post(serverUrl + '/api/posts', newPostData);
            },
            deletePost: function(postId){
                return $http.delete(serverUrl + '/api/posts/' + postId);
            }

        }
    })
    .factory('UserDataService', function ($http) {
 var serverUrl = "http://localhost:8080";
        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
            getUserInfo: function(){
                return $http.post(serverUrl + '/api/users');
            },
            getAllUsers: function(){
                return $http.get(serverUrl + '/api/users');
            },
            getAllFriends: function(){
                return $http.post(serverUrl + '/api/users');
            },
            getFriendRequest: function(){
                return $http.get(serverUrl + '/api/friendRequest');
            },
            sendFriendRequest: function(newFriendData){
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newFriendData);
            },
            respondFriendRequest: function(decisionData){
                return $http.post(serverUrl + '/api/friendRequest', decisionData);
            },
            //Next section for updating user settings
            updateUsername : function(newUsername){
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newUsername);
            },
            updatePassword : function(newPassword){
                return $http.post(serverUrl + '/api/users/' + localStorage.userid, newPassword);
            },
            updateEmail : function(newEmail){
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newEmail);
            },
            updateMaxPostTime: function(newMaxTime){
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newMaxTime);
            },
            updateProfileImg: function(newImg){
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newImg);
            }


        }
    })
    //Is used to keep infomation about the users current state in the app, such as the tag of the board they are viewing.
    .factory('UserStateService', function(){
        var currentTag = "";
        return {
            setCurrentTag: function(tag){
                currentTag = tag;
            },
            getCurrentTag: function(){
                return currentTag;
            }
        }
    })
;










