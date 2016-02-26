angular.module("livrio.services")
.factory("USER", ["$rootScope", "$http",   "$q", "$cordovaContacts", "settings", 'PUSH',  function($rootScope, $http, $q,  $cordovaContacts, settings,  PUSH) {

    var self = this;

    self.registerToken = function(token) {
        window.localStorage.token = token;
        $http.defaults.headers.common.Authorization = token;
    };

    function saveSession(user) {
        window.localStorage.user = JSON.stringify(user);
        $rootScope.user = user;
        PUSH.register( true);
    }


    self.updateContacts = function() {
        var deferred = $q.defer();
        if (!window.localStorage.syncContact) {
            $cordovaContacts.find({
                fields:['id','displayName','phoneNumbers','emails','birthdays','photos']
            }).then(function(allContacts) {
                $http.post( toRouter('/contacts') , allContacts)
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
            $http.patch( toRouter('/accounts/update'), {
                location: position.coords.latitude + "," + position.coords.longitude
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

        if (window.localStorage.pushToken) {
            try {
                post['deviceToken'] = JSON.parse(window.localStorage.pushToken);
            } catch (e) {}
        }

        angular.extend(post, params);

        $http.post( toRouter('/accounts/create'), post)
        .success(function(response) {
            if (response._status == 'OK') {
                deferred.resolve(response.data);
            }
            else {
                if (response._code === 10) {
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
        });

        return deferred.promise;
    };

    self.get = function(id){
        var deferred = $q.defer();

        $http.get(toRouter('/accounts/info'))
        .success(function(response) {

            if (response._status == 'OK') {
                deferred.resolve(response);

            }
            else {
                deferred.reject();
            }
        })
        .error(function(error) {
            deferred.reject();
        });

        return deferred.promise;
    };

    self.auth = function(params) {

        var deferred = $q.defer();

        var post = {};

        angular.extend(post, params);

        $http.post(toRouter('/auth'), post)
        .success(function(response) {

            if (response._status == 'OK') {
                self.registerToken(response.token);
                self.get(response._id)
                .then(function(data) {
                    saveSession(data);
                    deferred.resolve();
                });

                self.updateLocation();
            }
            else {
                deferred.reject(response);
            }
        })
        .error(function(error) {
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
            deferred.reject();
        });
        return deferred.promise;
    };

    return self;

}]);
