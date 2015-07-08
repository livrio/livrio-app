"use strict";
var DOMAIN_API = "http://livrio.codeway.in/v1";
// var DOMAIN_API = "http://api.livr.io/v1";
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
        LOAN: DOMAIN_API + "/loan",
        FRIEND: DOMAIN_API + "/friend",
        SHELF: DOMAIN_API + "/shelf",
        NOTIFICATION: DOMAIN_API + "/notification"
    },
    iOSApiKey: "961755098-c1f2cioji268glhuflmeil69trs5eudg.apps.googleusercontent.com"
})
.config(function($stateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider) {

    // $ionicConfigProvider.views.maxCache(10);
    // $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.tabs.position('top');

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            responseError: function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path("/login");
                    window.localStorage.clear();
                    window.location.reload();
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


    .state("library-form", {
        url: "/library-form/:id",
        templateUrl: "templates/library-add.html",
        controller: "libraryAddCtrl"
    })


    .state("main", {
        url: "/main",
        templateUrl: "templates/main.html"
    })

    .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/side_menu.html"
    })

    .state("app.config", {
        url: "/config",
        views: {
            "menuContent": {
                templateUrl: "templates/config.html"
            }
        }
    })

    .state("app.loanAdd", {
        url: "/loan-add",
        views: {
            "menuContent": {
                templateUrl: "templates/emprestimo.html",
                controller: "loanAddCtrl"
            }
        }
    })


    .state("app.terms", {
        url: "/terms",
        views: {
            "menuContent": {
                templateUrl: "templates/terms.html"
            }
        }
    })

    .state("app.privacy", {
        url: "/privacy",
        views: {
            "menuContent": {
                templateUrl: "templates/privacy.html"
            }
        }
    })

    .state("app.feedback", {
        url: "/feedback",
        views: {
            "menuContent": {
                templateUrl: "templates/feedback.html"
            }
        }
    })

    .state("app.bookAdd", {
        url: "/book-add",
        views: {
            "menuContent": {
                templateUrl: "templates/library-add.html",
                controller: "libraryAddCtrl"
            }
        }
    })

    .state("app.friendBook", {
        url: "/friend/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/library-friend.html",
                controller: "libraryFriendCtrl"
            }
        }
    })

    .state("app.friendAdd", {
        url: "/friend-add",
        views: {
            "menuContent": {
                templateUrl: "templates/friend-add.html",
                controller: "friendAddCtrl"
            }
        }
    })

    .state("app.profile", {
        url: "/profile",
        views: {
            "menuContent": {
                templateUrl: "templates/profile.html",
                controller: "profileCtrl"
            }
        }
    })

    .state("app.about", {
        url: "/about",
        views: {
            "menuContent": {
                templateUrl: "templates/about.html",
                controller: "aboutCtrl"
            }
        }
    })

    .state("app.shelf", {
        url: "/shelf/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/shelf.html",
                controller: "shelfCtrl"
            }
        }
    })

    .state("app.notification", {
        url: "/notification",
        views: {
            "menuContent": {
                templateUrl: "templates/notification.html",
                controller: "notificationCtrl"
            }
        }
    })

    .state("app.book", {
        url: "/book/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/library-view.html",
                controller: "libraryViewCtrl"
            }
        }
    })

    .state("app.tab", {
        url: "/tab",
        abstract: true,
        views: {
            "menuContent": {
                templateUrl: "templates/tabs.html",
                views: {
                    "tab-loan": {
                        templateUrl: "templates/tab-loan.html",
                        controller: "loanCtrl"
                    }
                }
            }
        }
    })

    .state("app.library", {
        url: "/library",
        views: {
            "menuContent": {
                templateUrl: "templates/tab-library.html",
                controller: "libraryCtrl"
            }
        }
    })


    .state("app.loan", {
        url: "/loan",
        views: {
            "menuContent": {
            templateUrl: "templates/tab-loan.html",
            controller: "loanCtrl"
        }
        }
    })
    .state("app.friends", {
        url: "/friends",
        views: {
            "menuContent": {
            templateUrl: "templates/tab-friends.html",
            controller: "friendsCtrl"
        }
        }
    });

    if (!window.localStorage.token) {
        $urlRouterProvider.otherwise("/login");
    }
    else {
        try {

            $rootScope.user = JSON.parse(window.localStorage.user);
            $httpProvider.defaults.headers.common.Authorization = window.localStorage.token;
            $urlRouterProvider.otherwise("/app/library");
        }
        catch (e) {
            $urlRouterProvider.otherwise("/login");
        }
    }
    // if none of the above states are matched, use this as the fallback


});
