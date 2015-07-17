
angular.module('starter.controllers', [])
.controller('loginCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, settings, USER ) {


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

    function firstLogin(name) {

        $ionicPopup.alert({
            template: '<img src="img/livrio1.png" />Olá <strong>' + name + '</strong>, seja vem vindo ao <strong>Livrio</strong> um rede de compartilhamento de livros entre amigos. Comece já cadastrando seus livros e tornando-os disponíveis para seus amigos.'
        }).then(function() {});
    }

    function testOffline() {
        if (!$rootScope.online) {
            $ionicPopup.alert({
                template: 'Você precisa está conectado a internet. Por favor verifique sua conexão!'
            }).then(function() {});
            return true;
        }

        return false;
    }

    $scope.doLogin = function(isValid) {

        if (testOffline()) {
            return;
        }
        if (isValid) {
            $ionicLoading.show({
                template: 'Entrando...'
            });

            var post = {
                email: $scope.form.email,
                password: $scope.form.password
            };

            USER.auth(post)
            .then(function(data) {
                $ionicLoading.hide();
                window.location = '#/app/library';
            },
            function(error) {
                console.log(error);
                $ionicLoading.hide();
                if (error.status === 0) {
                    $ionicPopup.alert({
                        template: 'Não foi possível se conectar. Por favor, verifique o acesso internet.'
                    }).then(function() {});
                }
                else {

                    $ionicPopup.alert({
                        template: '<strong>Email</strong>/<strong>Senha</strong> estão incorretos.'
                    }).then(function() {});
                }
            });
        }
    };

    $scope.doCreate = function(isValid) {
        if (testOffline()) {
            return;
        }
        if (isValid) {
            $ionicLoading.show({
                template: 'Cadastrando...'
            });

            var post = {
                fullname: $scope.form.fullname,
                email: $scope.form.email,
                password: $scope.form.password,
                origin: 'livrio'
            };

            USER.create(post)
            .then(function(user) {

                $ionicLoading.show({
                    template: 'Entrando...'
                });

                USER.auth(post)
                .then(function(data) {
                    $ionicLoading.hide();
                    window.location = '#/app/library';
                    firstLogin(data.first_name);
                },
                function() {
                    $ionicLoading.hide();
                });

            },
            function(p) {
                $ionicLoading.hide();

                if (p.email) {
                    $ionicPopup.alert({
                        template: '<strong>Email</strong> já cadastrado!'
                    }).then(function() {});
                }

            });
        }
    };

    $scope.doFacebook = function() {
        if (testOffline()) {
            return;
        }

        $ionicLoading.show({
            template: 'Entrando com Facebook...'
        });

        USER.authFacebook()
        .then(function(user) {
            console.log(user);
            $ionicLoading.hide();
            window.location = '#/app/library';
            if (user.create) {
                firstLogin(user.first_name);
            }
        },
        function() {
            $ionicLoading.hide();
            $ionicPopup.alert({
                template: 'Não foi possível se conectar. Por favor, verifique o acesso internet.'
            }).then(function() {});
        });

    };

});
