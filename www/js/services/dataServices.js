/**
 * Created by rylan on 07/02/15.
 * Data services handle all data related to a user such as, post data, board data, user data.
 */

angular.module('data.services', ['ngResource'])

    .factory('localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    /**
     * Board services
     * provides functionality to add board, retrieve boards
     */
    .factory('BoardService', function ($http) {
var serverUrl = "http://slightyused.info:8080";


        return {
            addBoard: function(newBoardData, token){
                $http.defaults.headers.common['x-auth'] = token;

                return $http.post(serverUrl + '/api/boards', newBoardData);
            },
            getPublishedBoards: function(token){
                $http.defaults.headers.common['x-auth'] = token;

                return $http.get(serverUrl + '/api/boards');
            },
            getMyBoard: function(token){
                $http.defaults.headers.common['x-auth'] = token;

                return $http.get(serverUrl + '/api/myboard');
            },
            getBoardByTag: function(tag, timestamp, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/test', {tag:tag,timestamp: timestamp});
            }

        }
    })

    /**
     * Post services
     * provides functionality to add and delete posts
     */
    .factory('PostService', function ($http) {
var serverUrl = "http://slightyused.info:8080";


        return {
            addPost: function(newPostData, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/posts', newPostData);
            },
            deletePost: function(postId, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.delete(serverUrl + '/api/posts/' + postId);
            }

        }
    })

    /**
     * User services
     * provides functionality to retrieve users and friends
     * as well as handles friend requests
     */
    .factory('UserDataService', function ($http) {
var serverUrl = "http://slightyused.info:8080";

        return {
            getUserInfo: function(token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/users');
            },
            getAllUsers: function(token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.get(serverUrl + '/api/users');
            },
            getAllFriends: function(token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/users');
            },
            getFriendRequest: function(token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.get(serverUrl + '/api/friendRequest');
            },
            sendFriendRequest: function(newFriendData, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newFriendData);
            },
            respondFriendRequest: function(decisionData, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/friendRequest', decisionData);
            },
            //Next section for updating user settings
            updateUsername : function(newUsername, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newUsername);
            },
            updatePassword : function(newPassword, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/users/' + localStorage.userid, newPassword);
            },
            updateEmail : function(newEmail, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newEmail);
            },
            updateMaxPostTime: function(newMaxTime, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newMaxTime);
            },
            updateProfileImg: function(newImg, token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newImg);
            },
            deleteUser: function(token){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.delete(serverUrl + '/api/users/' + localStorage.userid);
            },
            registerUserDevice: function(token, deviceInfo){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/push/subscribe', deviceInfo);
            },
            unregisterUserDevice: function(){
                $http.defaults.headers.common['x-auth'] = token;
                return $http.post(serverUrl + '/api/push/unsubscribe', deviceInfo);
            }


        }
    })

    /**
     * User State services
     * Is used to keep information about the users' current state in the app,
     *  such as the tag of the board they are currently viewing.
     */
    .factory('UserStateService', function(){
        var currentTag = "";
        var reply = false;
        return {
            setCurrentTag: function(tag){
                currentTag = tag;
            },
            getCurrentTag: function(){
                return currentTag;
            },
            setReply: function(updatedReply){
                reply = updatedReply;
            },
            getReply: function(){
                return reply;
            }
        }
    })
;










