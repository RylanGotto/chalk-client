/**
 * Created by will on 15/02/15.
 * Grabs all of the phone's contacts for display & adding
 */
angular.module('phoneContacts.controller', [])
    .controller('phoneContactsCtrl',
        function phoneContactsCtrl(
            $scope, AuthenticationService, $ionicLoading,
            $cordovaContacts, $location, $ionicScrollDelegate) {

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

            if (AuthenticationService.isLogged) {

                /**
                 * Retrieve all contacts from phone and
                 * add them to the scope.
                 * console.log any errors
                 */
                $scope.getContacts = function() {
                    $scope.showLoading();
                    $cordovaContacts.find({
                        fields: ['name', 'displayName', 'emails'],
                        filter: ''
                    }).then(function(result) {
                        result = pruneMissingContacts(result);
                        result = alphabetizeContacts(result);
                        $scope.contacts = result;
                    }, function(error) {
                        $scope.hideLoading();
                        console.log("ERROR: " + error);
                    });
                }
                $scope.getContacts();

                /**
                 * Look for missing contact information
                 * and only return an array of contacts with
                 * required info:
                 *  displayName
                 *  name
                 *  emails
                 * @param result Array : contacts from ng-Cordova
                 */
                function pruneMissingContacts(result) {
                    var actualContacts = [];
                    for(var i = 0; i < result.length; i++) {
                        if( result[i].name && result[i].displayName && result[i].emails ) {
                            actualContacts.push(result[i]);
                        }
                    }
                    $scope.hideLoading();
                    return actualContacts;
                }

                /**
                 * Split the array into their alphabetic positions
                 * @param contacts Array - result of pruneMissingContacts
                 */
                function alphabetizeContacts(contacts) {
                    var tmp={};
                    for(var i = 0 ; i < contacts.length; i++) {
                        var letter = contacts[i].displayName.toUpperCase().charAt(0);
                        if( tmp[letter] == undefined ) {
                            tmp[letter] = [];
                        }
                        tmp[letter].push( contacts[i] );
                    }
                    return tmp;
                }

                /**
                 * Send an email to the contact
                 * inviting them to the app
                 * @param contact
                 */
                $scope.sendOutsiderFriendRequest = function(contact) {
                    console.log(contact);
                }

                /**
                 * Jump to points in an alphabetized list
                 * @param id
                 */
                $scope.gotoList = function(id){
                    $location.hash(id);
                    $ionicScrollDelegate.anchorScroll();
                }

                $scope.alphabet = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
            }
        });