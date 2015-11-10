angular.module('starter.controllers')

.controller('friendAddCtrl', function($scope, $ionicHistory, $timeout, $filter,  $ionicPopup, $ionicModal, $ionicScrollDelegate, FRIEND, USER) {

    var trans = $filter('translate');

    $scope.empty_list = trans('add_friend.empty_list');
    $scope.empty_list_search = trans('add_friend.empty_list_search');

    $scope.activeTab = 0;
    $scope.hasScroll = false;
    $scope.pagging = false;
    var scroll = true;


    $ionicModal.fromTemplateUrl('templates/permission-contact.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalPermission = modal;
    });

    $scope.closeModal = function() {
        $scope.modalPermission.hide();
    };

    $scope.onReadContact = function() {
        $scope.readingContact = true;
        USER.updateContacts().then(function() {
            contactLoad = true;
            $scope.readingContact = false;
            $scope.modalPermission.hide();
            $scope.onChangeTab($scope.formFriend, 2);
        });
    };

    var contactLoad = false;

    function load() {
        $scope.pagging = true;
        FRIEND.all(params).then(function(data) {
            if (data.length >= 20) {
                $scope.hasScroll = true;
            }
            else {
                $scope.hasScroll = false;
            }
            angular.forEach(data, function(v) {
                $scope.friendsResult.push(v);
            });
            $ionicScrollDelegate.resize();
            $scope.pagging = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    var params = {};

    $scope.onChangeTab = function(form, tab) {

        if (tab == 2 && !contactLoad ) {
            $scope.modalPermission.show();return;
        }

        $scope.activeTab = tab;
        if (tab == 0) { //procurar
            params = {
                type: 'other'
            };
            $scope.showSearch = true;
        }
        else if (tab == 1) {
            params = {
                suggest: true,
                contacts: true
            };
            $scope.showSearch = false;
        }
        else if (tab == 2) {
            $scope.showSearch = true;
            params = {
                contacts: true
            };
        }

        $ionicScrollDelegate.scrollTop();


        params['limit'] = 20;
        params['page'] = 1;

        if (tab == 1) {
            params['limit'] = 100;
        }

        $scope.onClean(form);

        if (tab == 1) {
            params['limit'] = 100;
            scroll = false;
        }
    };


    var filterTextTimeout;

    $scope.searching = false;
    $scope.friendsResult = [];
    $scope.search = {};

    $scope.onSearch = function(input, reset) {
        console.log('search');
        if (input.length < 3) {
            if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
            }
            return;
        }
        if (filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {
            console.log(input);
            $scope.searching = true;
            if (reset) {
                $scope.friendsResult = [];
            }
            params['word'] = "%" + input + "%";
            $scope.pagging = true;
            $scope.searchStart = true;
            FRIEND.all(params).then(function(data) {
                $scope.searching = false;
                if (data.length >= 20) {
                    $scope.hasScroll = true;
                }
                else {
                    $scope.hasScroll = false;
                }
                angular.forEach(data, function(v) {
                    $scope.friendsResult.push(v);
                });
                $ionicScrollDelegate.resize();
                $scope.pagging = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
        console.log('clean');
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.search = {};
        }
        $scope.searching = false;
        $scope.friendsResult = [];
        $scope.hasScroll = false;
        $scope.searchStart = false;

        delete params['word'];
        load();
    };

    $scope.onAdd = function(item) {
        item.added = true;
        FRIEND.add(item);
    };

    $scope.onInvite = function(item) {
        item.invited = true;
        FRIEND.invite(item);
    };



    $scope.onChangeTab(null, 0);

    $scope.loadMore = function() {
        console.log('infinite:scroll');
        params['page'] = params['page'] + 1;
        var word = $scope.word;
        if (word.length >= 3) {
            $scope.onSearch($scope.word, true);
        }
        else {
            load();
        }

        console.log(params);
    }


});
