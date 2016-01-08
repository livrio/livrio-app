angular.module('livrio.services')
.factory('FRIEND', ['$rootScope','$http', '$q',  '$cordovaToast', '$filter', '$ionicModal', '$ionicActionSheet', '$ionicPopup', '$state', '$ionicHistory', 'settings', function($rootScope, $http, $q, $cordovaToast, $filter, $ionicModal, $ionicActionSheet, $ionicPopup, $state, $ionicHistory, settings) {

    var self = this;

    var trans = $filter('translate');

    self.all = function(params) {
        params = params || {};

        params.sort = 'name';
        params.order = 'asc';
        var deferred = $q.defer();
        $http.get(settings.URL.FRIEND, {
            params: params
        })
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve([]);
            }
        })
        .error(function() {
            deferred.resolve([]);
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    self.add = function(item) {
        var deferred = $q.defer();
        $http.post(settings.URL.FRIEND + "/" + item.id + "/request")
        .success(function(response) {
            if (!response.errors) {
                $cordovaToast.showLongBottom(trans('friends.toast_request_friend'));
                deferred.resolve(true);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
        });

        return deferred.promise;
    };

    self.invite = function(item) {
        var deferred = $q.defer();
        $http.post(settings.URL.FRIEND + "/" + item.id + "/invite")
        .success(function(response) {
            if (!response.errors) {
                $cordovaToast.showLongBottom(trans('friends.toast_request_friend'));
                deferred.resolve(true);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
        });

        return deferred.promise;
    };

    self.confirm = function(item, question) {
        var deferred = $q.defer();
        $http.post(settings.URL.FRIEND + "/" +  item.id  + "/response",{
            response: question
        })
        .success(function(response) {
            if (!response.errors) {
                if (question == 'yes') {
                    $cordovaToast.showLongBottom(trans('friends.toast_friend'));
                }
                deferred.resolve(true);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
        });

        return deferred.promise;
    };

    self.view = function(id) {
        var deferred = $q.defer();
        $http.get(settings.URL.FRIEND + "/" + id)
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    self.addOnFacebook = function() {

        var deferred = $q.defer();

        facebookConnectPlugin.login(['email','public_profile','user_friends'], function(res) {
            if (res.status === 'connected') {

                $http.post(settings.URL.FRIEND + "/add", {
                    token: res.authResponse.accessToken
                })
                .success(function(response) {
                    if (!response.errors) {
                        deferred.resolve(true);
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error(function() {
                    deferred.reject();
                });

            } else {
                deferred.reject();
            }
        },
        function() {
            deferred.reject();
        });

        return deferred.promise;
    };


    self.showModal = function(scope, book) {
        $ionicModal.fromTemplateUrl('templates/modal-friend.html', {
            scope: scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            modal.show();
        });
    };

    self.removeFriend = function(item) {
        $ionicPopup.confirm({
            title: trans('friend_profile.question_delete'),
            cancelText: trans('friend_profile.question_delete_no'),
            okText: trans('friend_profile.question_delete_yes'),
            template: trans('friend_profile.question_text')
        }).then(function(res) {
            if (res) {

                $http.post(settings.URL.FRIEND + "/" + item.id + "/remove")
                .success(function(response) {
                    if (!response.errors) {
                        $cordovaToast.showLongBottom(trans('friend_profile.toast_remove_friend'));
                        $rootScope.$emit("friend.refresh");
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.friend');
                    }
                });

                                    
            }
        });
    };




    self.menuAction = function(event, friend) {
        event.stopPropagation();

        var options = [];

        options.push({ text: "<i class=\"icon ion-close\"></i> " + trans('friend_profile.sheet_remove') });

        $ionicActionSheet.show({
            buttons: options,

            cancelText: trans('friend_profile.sheet_cancel'),
            buttonClicked: function(index) {
                if (index == 0) {
                    self.removeFriend(friend);

                }
                return true;
            }
        });
    };

    return self;


}]);
