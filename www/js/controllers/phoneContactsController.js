/**
 * Created by will on 15/02/15.
 * Grabs all of the phone's contacts for display & adding
 */
angular.module('phoneContacts.controller', [])
    .controller('phoneContactsCtrl',
        function phoneContactsCtrl($scope, AuthenticationService) {
            if (AuthenticationService.isLogged) {

                // Wait for device API libraries to load
                document.addEventListener("deviceready", onDeviceReady, false);

                // device APIs are available

                function onDeviceReady() {
                    $scope.showLoading();
                    var fields = ["displayName", "name", "emails"];
                    navigator.contacts.find(fields,
                        /**
                         * Contacts found successfully
                         * @param contacts
                         */
                        function(contacts) {
                            $scope.hideLoading();
                            $scope.contacts = contacts;
                        },
                        /**
                         * Contact finding Error
                         * @param contactError
                         */
                        function(contactError) {
                            $scope.hideLoading();
                            console.log('Error retrieving contacts');
                        });
                }

                // onSuccess: Get a snapshot of the current contacts

                //function onSuccess(contacts) {
                //
                //    //for (var i = 0; i < contacts.length; i++) {
                //    //    console.log("Display Name = " + contacts[i].displayName);
                //    //}
                //}
                //
                //// onError: Failed to get the contacts
                //
                //function onError(contactError) {
                //
                //}

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