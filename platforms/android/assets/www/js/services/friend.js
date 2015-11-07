angular.module('starter.services')
.factory('FRIEND', ['$http', '$q',  '$cordovaToast', '$filter', '$ionicModal','settings', function($http, $q, $cordovaToast, $filter, $ionicModal, settings) {

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

    self.confirm = function(item, response) {
        var deferred = $q.defer();
        $http.post(settings.URL.FRIEND + "/" +  item.created_by.id  + "/response",{
            notification: item.id,
            response: response
        })
        .success(function(response) {
            if (!response.errors) {
                if (response == 'yes'){
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

    return self;


}]);
