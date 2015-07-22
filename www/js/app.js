// Ionic Starter App

if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
            
            if(typeof args[number] != 'undefined'){
                return args[number]; 
            }
            return match;
        });
    };
}


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)

function formatDate(date){

    if(date){
        var m = (date.getMonth()+1)+"";
        var y = date.getFullYear();
        var d = (date.getDate())+"";

        if(m.length==1){
            m = "0"+m;
        }

        if(d.length==1){
            d = "0"+d;
        }


        return y+ "-"+m+"-"+d;
    }

    return;
}

angular.module('starter', [
  'ionic',
  'ngMessages',
  'ngCordova',
  'ionic.rating',
  'ionic.service.core',
  'ionic.service.push',
  'starter.controllers',
  'starter.services',
  'starter.config',
  'pascalprecht.translate'
  ])

.run(function($rootScope, $http, $ionicPlatform, $translate) {

    document.addEventListener("deviceready", function() {
        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {
                var lang = (language.value).toLowerCase().split("-")[0];
                console.log(lang);
                

                $translate.use(lang).then(function(data) {
                    console.log(data);
                    window.localStorage.lang = data;
                }, function(error) {
                    
                });
            }, null);
        }
    });


    document.addEventListener("deviceready", function() {
        window.analytics.startTrackerWithId('UA-65249891-2');

        cordova.getAppVersion.getVersionNumber().then(function (version) {
            $rootScope.versionApp = version;
        });
    });

    $ionicPlatform.ready(function() {

        ionic.Platform.isFullScreen = true;

        if (window.cordova && window.cordova.plugins.Keyboard) {
            //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

    });


    $http.defaults.headers.common['Content-Type'] = 'application/json';
    //sessionStorage.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJhdXJlbGlvQGNvZGV3YXkuY29tLmJyIiwibmFtZSI6IkF1clx1MDBlOWxpbyBTYXJhaXZhIiwiYWRtaW4iOnRydWUsInRva2VuIjoiYTJkYmU0Njg1ZTAzZDYxOWQ3ZTU1YjkwODllMjgwM2MifQ.HG-_yyj7KEs-tqiXKOs7C827OAzVsvT3ftH_tSU4vzQ';

    try {
        $rootScope.user = JSON.parse(window.localStorage.user);
        $http.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');
        window.location = '#/app/library';
    }
    catch (e) {
        window.location = '#/login';
        console.log(e);
    }


    $rootScope.online = true;

    $rootScope.isRun = true;


    document.addEventListener("online", function(){
        $rootScope.online = true;
        console.log('offline');
    }, false);

    document.addEventListener("offline", function(){
        $rootScope.online = false;
        console.log('offline');
    }, false);


    document.addEventListener("pause", function(){

        $rootScope.isRun = false;
    }, false);


    document.addEventListener("resume", function(){
        console.log('resume');
        $rootScope.isRun = true;
    }, false);
});
