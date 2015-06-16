"use strict";
// var DOMAIN_API = "http://livrio.codeway.in/v1";
var DOMAIN_API = "http://api.livr.io/v1";
angular.module("starter.config",[])
.constant("settings", {
    API_BASE_URL: "http://api.wiflip.in/v1",
    GA: "UA-54794657-1",
    URL: {
        USER: DOMAIN_API + "/user",
        LOGIN: DOMAIN_API + "/auth/login",
        LOGOUT: DOMAIN_API + "/auth/logout",
        ISBN: DOMAIN_API + "/isbn",
        BOOK: DOMAIN_API + "/book",
        FRIEND: DOMAIN_API + "/friend"
    },
    iOSApiKey: "961755098-c1f2cioji268glhuflmeil69trs5eudg.apps.googleusercontent.com"
})
.config(function($stateProvider, $httpProvider, $urlRouterProvider) {


    $httpProvider.interceptors.push(function($q, $location) {
        return {
            responseError: function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path("/login");
                }
                return $q.reject(response);
            }
        };
    });

    $stateProvider
    .state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "loginCtrl"
    })

    .state("library-add", {
        url: "/library-add",
        templateUrl: "templates/library-add.html",
        controller: "libraryAddCtrl"
    })

    .state("about", {
        url: "/about",
        templateUrl: "templates/about.html",
        controller: "aboutCtrl"
    })
    .state("library-view", {
        url: "/library-view/:id",
        templateUrl: "templates/library-view.html",
        controller: "libraryViewCtrl"
    })

    .state("library-friend", {
        url: "/library-friend/:id",
        templateUrl: "templates/library-friend.html",
        controller: "libraryFriendCtrl"
    })

    .state("profile", {
        url: "/profile",
        templateUrl: "templates/profile.html",
        controller: "profileCtrl"
    })

    .state("main", {
        url: "/main",
        templateUrl: "templates/main.html"
    })


    // setup an abstract state for the tabs directive
    .state("tab", {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state("tab.library", {
        url: "/library",
        views: {
            "tab-library": {
            templateUrl: "templates/tab-library.html",
            controller: "libraryCtrl"
        }
        }
    })

    .state("tab.loan", {
        url: "/loan",
        views: {
            "tab-loan": {
            templateUrl: "templates/tab-loan.html",
            controller: "loanCtrl"
        }
        }
    })
    .state("tab.friends", {
        url: "/friends",
        views: {
            "tab-friends": {
            templateUrl: "templates/tab-friends.html",
            controller: "friendsCtrl"
        }
        }
    });
    if (!window.localStorage.token) {
        $urlRouterProvider.otherwise("/login");
    }
    else {
        $httpProvider.defaults.headers.common.Authorization = window.localStorage.token;
        $urlRouterProvider.otherwise("/tab/library");
    }
    // if none of the above states are matched, use this as the fallback


});
