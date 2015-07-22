
angular.module('starter.controllers', [])
.controller('loginCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $filter,  settings, USER ) {

    var trans = $filter('translate');

    document.addEventListener("deviceready", function() {
        window.analytics.trackView('login_start');
    });

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
            template: '<img src="img/livrio1.png" />' + trans('welcome')
        }).then(function() {});
    }

    function testOffline() {
        if (!$rootScope.online) {
            $ionicPopup.alert({
                template: trans('offline')
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
                template: trans('login.loading_login')
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
                        template: trans('offline')
                    }).then(function() {});
                }
                else {

                    $ionicPopup.alert({
                        template: trans('login.login_invalid')
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
                template: trans('login.loading_create')
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
                    template: trans('login.loading_login')
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
                        template: trans('login.email_duplicate')
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
            template: trans('login.loading_facebook')
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
                template: trans('offline')
            }).then(function() {});
        });

    };

});
