angular.module("livrio.services")
.factory("USER", ["$rootScope", "$http",   "$q", "$cordovaContacts", "settings", 'PUSH',  function($rootScope, $http, $q,  $cordovaContacts, settings,  PUSH) {

    var self = this;

    function saveSession(user, token) {
        window.localStorage.token = token;
        $http.defaults.headers.common.Authorization = token;
        window.localStorage.user = JSON.stringify(user);
        $rootScope.user = user;

        PUSH.register({
            name: user.fullname
        });
    }


    self.updateContacts = function() {
        var deferred = $q.defer();
        if (!window.localStorage.syncContact) {
            $cordovaContacts.find({
                fields:['id','displayName','phoneNumbers','emails','birthdays','photos']
            }).then(function(allContacts) {
                $http.post(settings.URL.CONTACT, allContacts)
                .success(function() {
                    window.localStorage.syncContact = true;
                    deferred.resolve();
                })
                .error(function() {
                    window.localStorage.syncContact = false;
                    deferred.reject();
                });
            },
            function() {
                window.localStorage.syncContact = false;
                deferred.reject();
            });
        }
        else {
            deferred.resolve();
        }
        return deferred.promise;
    }


    self.updateLocation = function() {
        var user = $rootScope.user;

        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            $http.put(settings.URL.USER + "/" + user.id, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    };

    self.updateAmountBook = function(sub) {
        if (sub) {
            $rootScope.user.amount_book--;
            if ($rootScope.user.amount_book < 0) {
                $rootScope.user.amount_book = 0;
            }
        }
        else {
            $rootScope.user.amount_book++;
        }

        window.localStorage.user = JSON.stringify($rootScope.user);
    };

    self.create = function(params) {
        var deferred = $q.defer();


        var post = {
            version: $rootScope.versionApp,
            device: ionic.Platform.platform() + ':' + ionic.Platform.version(),
            origin: 'livrio'
        };

        angular.extend(post, params);

        $http.post(settings.URL.USER, post)
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                if (response.errors.code === 10) {
                    deferred.reject({
                        email:true
                    });
                }
                else {
                    deferred.reject(response);
                }
            }
        })
        .error(function(error) {
            deferred.reject({
                status: 0
            });
            console.error('TRATAR ERROR');
        });

        return deferred.promise;
    };

    self.auth = function(params) {

        var deferred = $q.defer();

        var post = {};

        angular.extend(post, params);

        $http.post(settings.URL.LOGIN, post)
        .success(function(response) {

            if (!response.errors) {
                saveSession(response.data.user, response.data.token);
                deferred.resolve(response.data.user);
                self.updateLocation();
            }
            else {
                deferred.reject(response);
            }
        })
        .error(function(error) {
            console.log('arguments', arguments);
            deferred.reject({
                status: 0
            });
        });

        return deferred.promise;
    };

    self.authFacebook = function() {
        var deferred = $q.defer();

        facebookConnectPlugin.login(['email','public_profile','user_friends'], function(res) {
            if (res.status === 'connected') {
                console.log(res.authResponse.accessToken);
                var params = {
                    token: res.authResponse.accessToken,
                    origin: 'facebook'
                };

                //tenta efetuar login com facebook
                self.auth(params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(res) {

                    if (res.errors && res.errors.code == 96) {
                        facebookConnectPlugin.logout(function() {
                            deferred.reject({status:96});
                        },
                        function() {
                            deferred.reject({status:96});
                        });
                    }
                    else {
                        //cria um usuário se ainda não existe
                        self.create(params)
                        .then(function() {

                            //tenta efetuar login navamente
                            self.auth(params)
                            .then(function(data) {
                                console.log('facebook create');
                                data.create = true
                                deferred.resolve(data);
                            },
                            function() {
                                deferred.reject();
                            });

                        },function() {
                            deferred.reject();
                        });
                    }
                });

            } else {
                deferred.reject();
            }
        },
        function() {
            console.info(arguments);
            deferred.reject();
        });
        return deferred.promise;
    };

    return self;

}]);
