
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {

            if (typeof args[number] != 'undefined') {
                return args[number];
            }
            return match;
        });
    };
}


function formatDate(date) {

    if (date) {
        var m = (date.getMonth() + 1) + "";
        var y = date.getFullYear();
        var d = (date.getDate()) + "";

        if (m.length == 1) {
            m = "0" + m;
        }

        if (d.length == 1) {
            d = "0" + d;
        }

        return y + "-" + m + "-" + d;
    }

    return;
}

function convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

moment.locale('en', {
  relativeTime: {
    future : 'em %s',
    past : '%s atrás',
    s : 'poucos segundos',
    m : 'um minuto',
    mm : '%d minutos',
    h : 'uma hora',
    hh : '%d horas',
    d : 'um dia',
    dd : '%d dias',
    M : 'um mês',
    MM : '%d meses',
    y : 'um ano',
    yy : '%d anos'
  }
});

angular.module('livrio', [
  'ionic',
  'ngMessages',
  'ngCordova',
  'livrio.controllers',
  'livrio.services',
  'livrio.config',
  'livrio.directives',
  'ionicLazyLoad',
  'angularMoment',
  'monospaced.elastic',
  'pascalprecht.translate'
  ])

.run(function($rootScope, $http, $ionicPlatform, $ionicHistory, $translate, $state, $filter, USER) {

    var trans = $filter('translate');

    document.addEventListener("deviceready", function() {

        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {
                $http.defaults.headers.common['X-App-Platform-Lang'] = language.value;
                // var lang = (language.value).toLowerCase().split("-")[0];
                var lang = language.value

                $translate.use(lang).then(function(data) {
                    window.localStorage.lang = data;
                });

            }, null);
        }
    });



    document.addEventListener("deviceready", function() {
        window.analytics.startTrackerWithId('UA-65249891-2');

        cordova.getAppVersion.getVersionNumber().then(function(version) {
            $rootScope.versionApp = version;
            $http.defaults.headers.common['X-App-Version'] = version;
        });
    });


    $ionicPlatform.registerBackButtonAction(function(e) {
        if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
        }

        else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        }
        else if ($state.current.name != 'app.book') {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('app.book');
        }
        else {
            $rootScope.backButtonPressedOnceToExit = true;

            window.plugins.toast.showShortCenter(
                trans('app.backbutton')
            );
            setTimeout(function() {
                $rootScope.backButtonPressedOnceToExit = false;
            },2000);
        }
        e.preventDefault();
        return false;
    },101);


    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['X-App-Platform'] = ionic.Platform.platform();
    $http.defaults.headers.common['X-App-Platform-Version'] = ionic.Platform.version();


    try {
        $rootScope.user = JSON.parse(window.localStorage.user);
        $http.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');
        window.location = '#/app/book';
        // window.location = '#/app/book-view/56bd44b7f387bc212b83b524';
        document.addEventListener("deviceready", function() {
            USER.updateLocation();
        });
    }
    catch (e) {
        window.location = '#/login';
    }

    $rootScope.online = true;

    document.addEventListener("online", function() {
        $rootScope.online = true;
    }, false);

    document.addEventListener("offline", function() {
        $rootScope.online = false;
    }, false);

});
