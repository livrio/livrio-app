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
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngMessages',
  'checklist-model',
  'ngCordova',
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
});
