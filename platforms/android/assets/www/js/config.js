"use strict";
var DOMAIN_API = "http://api.livr.io/v1";


angular.module("starter.config",[
    'pascalprecht.translate'
    ])
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
        CONTACT: DOMAIN_API + "/contact",
        SHELF: DOMAIN_API + "/shelf",
        NOTIFICATION: DOMAIN_API + "/notification"
    },
    iOSApiKey: "961755098-c1f2cioji268glhuflmeil69trs5eudg.apps.googleusercontent.com"
})
.config(function($stateProvider, $httpProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

    

    $translateProvider.preferredLanguage("pt");
    $translateProvider.fallbackLanguage("pt");


    // $ionicConfigProvider.views.maxCache(10);
    // $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.tabs.position('top');

    $httpProvider.interceptors.push(function($q, $location, $cordovaToast) {
        return {
            responseError: function(response) {
                console.log(response);
                if (response.status === 401 || response.status === 403) {
                    $location.path("/login");
                    window.localStorage.clear();
                    window.location.reload();
                }

                if (response.status == 0) {
                    console.log('offline');
                    $cordovaToast.showLongBottom("Você está offline!").then(function() {});
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


    .state("app.book-form", {
        url: "/book-form/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-form.html",
                controller: "bookAddCtrl"
            }
        }
    })

    .state("app.bookAdd", {
        url: "/book-form",
        views: {
            "menuContent": {
                templateUrl: "templates/book-form.html",
                controller: "bookAddCtrl"
            }
        }
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
                templateUrl: "templates/config.html",
                controller: "configCtrl"
            }
        }
    })

    .state("app.loanAdd", {
        url: "/loan-add",
        views: {
            "menuContent": {
                templateUrl: "templates/book-loan.html",
                controller: "loanAddCtrl"
            }
        }
    })

    .state("app.recommend", {
        url: "/recommend",
        views: {
            "menuContent": {
                templateUrl: "templates/book-recommend.html",
                controller: "recommendCtrl"
            }
        }
    })

    .state("app.comment", {
        url: "/comment",
        views: {
            "menuContent": {
                templateUrl: "templates/book-comment.html",
                controller: "commentCtrl"
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



    .state("app.friendBook", {
        url: "/friend/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-friend.html",
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
                templateUrl: "templates/book-view.html",
                controller: "libraryViewCtrl"
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

    .state("app.book-search", {
        url: "/book-search",
        views: {
            "menuContent": {
                templateUrl: "templates/book-search.html",
                controller: "bookSearchCtrl"
            }
        }
    })

    .state("app.invite", {
        url: "/invite",
        views: {
            "menuContent": {
                templateUrl: "templates/invite.html",
                controller: "inviteCtrl"
            }
        }
    })

    .state("app.contact", {
        url: "/contact",
        views: {
            "menuContent": {
                templateUrl: "templates/contacts.html",
                controller: "contactCtrl"
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
