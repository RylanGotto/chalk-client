/**
 * Created by rylan on 07/02/15.
 * Data services handle all data related to a user such as, post data, board data, user data.
 */

angular.module('data.services', ['ngResource'])

    /**
     * Board services
     * provides functionality to add board, retrieve boards
     */
    .factory('BoardService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

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

    /**
     * Post services
     * provides functionality to add and delete posts
     */
    .factory('PostService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

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

    /**
     * User services
     * provides functionality to retrieve users and friends
     * as well as handles friend requests
     */
    .factory('UserDataService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";
        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
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
            },respondFriendRequest: function(decisionData){
                return $http.post(serverUrl + '/api/friendRequest', decisionData);
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










