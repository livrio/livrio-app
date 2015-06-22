angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $rootScope, $http, $ionicPopup, $ionicLoading, settings ) {

    $scope.tab = 0;

    $scope.onChangeTab = function(index) {
        $scope.tab = index;
        $ionicSlideBoxDelegate.slide(index);
    };


    $scope.form = {
        fullname: '',
        email: window.localStorage.email || '',
        password: window.localStorage.password || ''
    };

    $scope.doLogin = function(isValid) {
        if (isValid) {
            $ionicLoading.show({
                template: 'Entrando...'
            });

            var post = {
                email: $scope.form.email,
                password: $scope.form.password
            };



            $http.post(settings.URL.LOGIN, post)
            .success(function(response) {
                $ionicLoading.hide();
                if (!response.errors) {
                    window.localStorage.token = response.data.token;
                    $http.defaults.headers.common.Authorization = window.localStorage.token;
                    window.localStorage.user = JSON.stringify(response.data.user);
                    $rootScope.user = response.data.user;

                    window.location = '#/app/tab/library';
                }
                else {
                    $ionicPopup.alert({
                        template: '<strong>Email</strong>/<strong>Senha</strong> estão incorretos.'
                    }).then(function() {});
                }
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
                $ionicLoading.hide();
                console.error('TRATAR ERROR');
                $rootScope.$emit("error.http");
            });

        }
    };

    $scope.doCreate = function(isValid) {
        if (isValid) {
            $ionicLoading.show({
                template: 'Cadastrando...'
            });

            var post = {
                fullname: $scope.form.fullname,
                email: $scope.form.email,
                password: $scope.form.password
            };



            $http.post(settings.URL.USER, post)
            .success(function(response) {
                $ionicLoading.hide();
                if (!response.errors) {
                    $scope.doLogin(true);
                }
                else {
                    if (response.errors[0].code === 10) {
                        $ionicPopup.alert({
                            template: '<strong>Email</strong> já cadastrado!'
                        }).then(function() {});
                    }
                }
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
                $ionicLoading.hide();
                console.error('TRATAR ERROR');
            });

        }
    };

    function errorFacebook(region) {
        console.error('ERROR FACEBOOK');
        $ionicLoading.hide();
        $ionicPopup.alert({
            template: 'O Facebook apresentou um erro e não permitiu o login.' + region
        }).then(function() {});
    }

    function loginFacebook(token, create) {
        //me?fields=id,name,gender,birthday
        var post = {
            token: token
        };
        console.log(token);
        $http.post(settings.URL.LOGIN, post)
        .success(function(response) {
            $ionicLoading.hide();
            console.log(JSON.stringify(response));
            if (!response.errors) {
                window.localStorage.token = response.data.token;
                $http.defaults.headers.common.Authorization = window.localStorage.token;
                $rootScope.user = response.data.user;
                window.location = '#/app/tab/library';
            }
            else if (create) {
                $http.post(settings.URL.USER, post)
                .success(function(response) {
                    if (!response.errors) {
                        loginFacebook(token, false);
                    }
                    else {
                        errorFacebook(1);
                    }
                })
                .error(function() {
                    errorFacebook(2);
                });
            }
        })
        .error(function() {
            errorFacebook(3);
        });
    }



    $scope.doFacebook = function() {

        $ionicLoading.show({
            template: 'Entrando com Facebook...'
        });

        facebookConnectPlugin.login(['email','public_profile','user_friends'], function(res) {
            if (res.status === 'connected') {
                loginFacebook(res.authResponse.accessToken, true);
            } else {
                errorFacebook(5);
            }
        },
        function() {
            console.log(JSON.stringify(arguments));
            errorFacebook(6);
        });

    };

});
