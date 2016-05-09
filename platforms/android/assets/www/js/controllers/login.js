
angular.module('livrio.controllers', [])
.controller('login_ctrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $ionicHistory, $ionicPopup, $filter,  settings, USER, PUSH ) {

    var trans = $filter('translate');

    document.addEventListener("deviceready", function() {
        PUSH.register();
    });

    $scope.tab = 0;

    $scope.loading = false;

    $scope.loadingText = trans('login.loading_login');

    function showLoading(text) {
        $scope.loading = true;
        if (text) {
            $scope.loadingText = text;
        }
    }

    function hideLoading() {
        $scope.loading = false;
        $scope.loadingText = trans('login.loading_login');
    }

    $scope.onChangeTab = function(index) {
        $scope.tab = index;
    };

    $scope.form = {
        fullname: '',
        email: window.localStorage.email || '',
        password: window.localStorage.password || ''
    };

    function firstLogin(name) {

        $ionicPopup.alert({
            template: String.format(trans('app.welcome'),name) + '<div style="text-align: center;margin-top: 20px;"><img src="img/official.svg" style="width:130px"/></div>'
        }).then(function() {});
    }

    function testOffline() {
        if (!$rootScope.online) {
            $ionicPopup.alert({
                template: trans('app.offline')
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
            showLoading(trans('login.loading_login'));

            var post = {
                email: $scope.form.email,
                password: $scope.form.password
            };

            USER.auth(post)
            .then(function(data) {
                $ionicHistory.clearCache();
                window.location = '#/app/book';
            },
            function(error) {
                hideLoading();
                if (error.status === 0) {
                    $ionicPopup.alert({
                        template: trans('app.offline')
                    }).then(function() {});
                }
                else if (error.status == 96) {
                }
                else {

                    $ionicPopup.alert({
                        template: trans('login.login_invalid')
                    });
                }
            });
        }
    };

    $scope.doCreate = function(isValid) {
        if (testOffline()) {
            return;
        }
        if (isValid) {

            showLoading(trans('login.loading_create'));

            var post = {
                fullname: $scope.form.fullname,
                email: $scope.form.email,
                password: $scope.form.password,
                origin: 'livrio'
            };

            USER.create(post)
            .then(function(user) {
                showLoading(trans('login.loading_login'));

                USER.auth(post)
                .then(function(data) {
                    $ionicHistory.clearCache();
                    window.location = '#/app/friend-invite';
                    //firstLogin();
                    hideLoading();
                },
                function() {
                    hideLoading();
                });

            },
            function(p) {
                hideLoading();

                if (p.email) {
                    $ionicPopup.alert({
                        template: trans('login.email_duplicate')
                    });
                }

            });
        }
    };

    $scope.doFacebook = function() {
        if (testOffline()) {
            return;
        }


        showLoading(trans('login.loading_facebook'));

        USER.authFacebook()
        .then(function(user) {
            hideLoading();
            window.location = '#/app/book';
            // if (user.create) {
                //firstLogin(user.first_name);
            // }
        },
        function(error) {
            hideLoading();
            if (error && error.status == 96) {
                $ionicPopup.alert({
                    template: trans('login.login_facebook')
                });
            }
            else {
                $ionicPopup.alert({
                    template: trans('app.offline')
                });
            }
        });

    };


    $scope.onChangeTabSlide = function(index) {
        $scope.hideCount = index == 3;
    }

    $scope.onSkip = function() {
        console.log('skip');
        $ionicSlideBoxDelegate.slide(3);
    }

});
