// Ionic Starter App

function columnize(input, cols) {
    var arr = [], colIdx=-1, i;
    for (i = 0; i < input.length; i++) {

        if ((i % cols) === 0) {
            colIdx++;
            arr[ colIdx ] = [];
        }

        arr[colIdx].push(input[i]);
    }
    return arr;
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
  'checklist-model',
  'ngCordova',
  'ionic.rating',
  'ionic.service.core',
  'ionic.service.push',
  'starter.controllers',
  'starter.services',
  'starter.config'
  ])

.run(function($rootScope, $http) {


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
    }, false);

    document.addEventListener("offline", function(){
        $rootScope.online = false;
    }, false);


    document.addEventListener("pause", function(){

        $rootScope.isRun = false;
    }, false);


    document.addEventListener("resume", function(){
        console.log('resume');
        $rootScope.isRun = true;
    }, false);
});
