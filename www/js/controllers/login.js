
angular.module('starter.controllers', [])

.directive('slidePosition', [ function() {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs, $parent) {
            console.log($element);

            var parent = $element.parent();

            function onSlideMove() {
                var targetTab = angular.element($element[0]);
                var indicatorPos = parseInt(targetTab.prop("style").OTransform.replace(/[^0-9.\-]/g, ""),10);
                var indicatorPosParent = parent.prop("style").backgroundPositionX.replace(/[^0-9.\-]/g, "");
                console.log(indicatorPosParent, indicatorPos, indicatorPosParent+indicatorPos);

                if(indicatorPos>100){
                    indicatorPos=100;
                }

                parent.css({
                    "background-position-x":(indicatorPosParent+indicatorPos) + "%"
                });

            }



            

            ionic.onGesture("dragleft", onSlideMove, $element[0]);
            ionic.onGesture("dragright", onSlideMove, $element[0]);
        }
    }
}])
.controller('loginCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $rootScope, $http, $ionicPopup, $ionicLoading, settings, PUSH ) {

    $scope.tab = 0;

    $scope.slideClass = 'teste';


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
                    console.log('auth1');
                    window.localStorage.user = JSON.stringify(response.data.user);
                    var user = response.data.user;
                    PUSH.register({
                        name: user.fullname
                    });
                    $rootScope.user = response.data.user;

                    window.location = '#/app/library';
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
        console.error('ERROR FACEBOOK:' + region);
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
                window.localStorage.user = JSON.stringify(response.data.user);
                $rootScope.user = response.data.user;

                PUSH.register({
                    name: response.data.user.fullname
                });

                window.location = '#/app/library';
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
