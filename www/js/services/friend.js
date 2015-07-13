angular.module('starter.services')
.factory('FRIEND', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$ionicActionSheet', 'settings', function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, $ionicActionSheet, settings) {

    var self = this;

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
                $cordovaToast.showLongBottom("Solicitação enviada!");
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
                    $cordovaToast.showLongBottom("Vocês são amigos agora!");
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


    self.inviteEmail = function() {


        var tpl = [
            "<p>Infome o nome e e-mail do seu amigo e nós enviaremos um convite!</p>",
            "<label class=\"item-input item-stacked-label\">",
                "<span class=\"input-label\">Nome completo</span>",
                "<input type=\"text\">",
            "</label>",
            "<label class=\"item-input item-stacked-label\">",
                "<span class=\"input-label\">E-mail</span>",
                "<input type=\"email\">",
            "</label>"
        ];

        $ionicPopup.show({
            title: "Enviar convite",
            template: tpl.join(''),
            cssClass: 'popup-invite-email',
            buttons: [
                { text: "Cancelar" },
                {
                    text: "Enviar",
                    onTap: function(e) {
                        $cordovaToast.showLongBottom("Seu amigo receberá um e-mail!");
                    }
                }
            ]
        }).then(function(res) {});

    };


    return self;


}]);
