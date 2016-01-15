"use strict";
var DOMAIN_API = "http://api.livr.io/v1";
DOMAIN_API = "http://livrio.codeway.in/v1";

angular.module("livrio.config",[
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
        QUESTION: DOMAIN_API + "/question",
        TERMS: DOMAIN_API + "/terms",
        NOTIFICATION: DOMAIN_API + "/notification"
    }
})
.config(function($stateProvider, $httpProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage("pt_BR");
    $translateProvider.fallbackLanguage("pt_BR");


    // $ionicConfigProvider.views.maxCache(10);
    // $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.tabs.position('top');
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.spinner.icon('android');
    $ionicConfigProvider.backButton.icon('ion-android-arrow-back');
    $ionicConfigProvider.navBar.alignTitle('left');

    var v = parseInt(ionic.Platform.version(),10);
    $ionicConfigProvider.scrolling.jsScrolling(ionic.Platform.isAndroid() && v <= 4 || (!ionic.Platform.isAndroid()));

    $httpProvider.interceptors.push(function($q, $location, $cordovaToast, $filter) {
        // var trans = $filter('translate');
        var trans = function(v) {
            return v;
        }
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
        controller: "login_ctrl"
    })

    .state("app.privacy", {
        url: "/privacy",
        views: {
            "menuContent": {
                templateUrl: "templates/privacy.html"
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
                controller: "config_ctrl"
            }
        }
    })

    .state("app.profile", {
        url: "/profile",
        views: {
            "menuContent": {
                templateUrl: "templates/profile.html",
                controller: "profile_ctrl"
            }
        }
    })

    .state("app.about", {
        url: "/about",
        views: {
            "menuContent": {
                templateUrl: "templates/about.html",
                controller: "about_ctrl"
            }
        }
    })

    .state("app.help", {
        url: "/help",
        views: {
            "menuContent": {
                templateUrl: "templates/help.html",
                controller: "help_ctrl"
            }
        }
    })

    .state("app.notification", {
        url: "/notification",
        views: {
            "menuContent": {
                templateUrl: "templates/notification.html",
                controller: "notification_ctrl"
            }
        }
    })

    /*
        ----> ROUTE: LIVROS
    */

    .state("app.book-add", {
        url: "/book-add",
        views: {
            "menuContent": {
                templateUrl: "templates/book-add.html",
                controller: "book_add_ctrl"
            }
        }
    })


    .state("app.book-form", {
        url: "/book-form/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-form.html",
                controller: "book_form_ctrl"
            }
        }
    })

    .state("app.book", {
        url: "/book",
        views: {
            "menuContent": {
                templateUrl: "templates/book.html",
                controller: "book_ctrl"
            }
        }
    })

    .state("app.book-search", {
        url: "/book-search",
        views: {
            "menuContent": {
                templateUrl: "templates/book-search.html",
                controller: "book_search_ctrl"
            }
        }
    })

    .state("app.book-view", {
        url: "/book-view/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-view.html",
                controller: "book_view_ctrl"
            }
        }
    })

    .state("app.book-lend", {
        url: "/book-lend/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-lend.html",
                controller: "book_lend_ctrl"
            }
        }
    })

    .state("app.book-recommend", {
        url: "/book-recommend/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-recommend.html",
                controller: "book_recommend_ctrl"
            }
        }
    })

    .state("app.book-comment", {
        url: "/book-comment/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-comment.html",
                controller: "book_comment_ctrl"
            }
        }
    })

    .state("app.book-loan", {
        url: "/book-loan",
        views: {
            "menuContent": {
                templateUrl: "templates/book-loan.html",
                controller: "book_loan_ctrl"
            }
        }
    })

    .state("app.book-shelf", {
        url: "/book-shelf/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/book-shelf.html",
                controller: "book_shelf_ctrl"
            }
        }
    })

    /*
        ----> ROUTE: AMIGOS
    */

    .state("app.friend-profile", {
        url: "/friend-profile/:id",
        views: {
            "menuContent": {
                templateUrl: "templates/friend-profile.html",
                controller: "friend_profile_ctrl"
            }
        }
    })

    .state("app.friend-invite", {
        url: "/friend-invite",
        views: {
            "menuContent": {
                templateUrl: "templates/friend-invite.html",
                controller: "friend_invite_ctrl"
            }
        }
    })

    .state("app.friend-search", {
        url: "/friend-search",
        views: {
            "menuContent": {
                templateUrl: "templates/friend-search.html",
                controller: "friend_search_ctrl"
            }
        }
    })

    .state("app.friend", {
        url: "/friend",
        views: {
            "menuContent": {
                templateUrl: "templates/friend.html",
                controller: "friend_ctrl"
            }
        }
    })




    ;


    $urlRouterProvider.otherwise("/login");

});
