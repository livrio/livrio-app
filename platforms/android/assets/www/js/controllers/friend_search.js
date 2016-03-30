angular.module('livrio.controllers')

.controller('friend_search_ctrl', function($scope, $timeout, $filter, $ionicModal, $ionicScrollDelegate, FRIEND, USER) {

    var trans = $filter('translate');

    $scope.activeTab = 0;
    $scope.hasScroll = false;
    $scope.pagging = false;
    var scroll = true;


    $ionicModal.fromTemplateUrl('templates/modal/permission-contact.html', {
        scope: $scope
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
                where: 'other'
            };
            $scope.showSearch = true;
        }
        else if (tab == 1) {
            params = {
                where: 'suggest'
            };
            $scope.showSearch = false;
        }
        else if (tab == 2) {
            $scope.showSearch = true;
            params = {
                where: 'contacts'
            };
        }

        $ionicScrollDelegate.scrollTop();


        params['limit'] = 20;
        params['offset'] = 1;

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
        if (input.length == 0) {
            $scope.onClean($scope.formFriend);
            return;
        } else if (input.length < 3) {
            if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
            }
            return;
        }

        if (filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {
            $scope.searching = true;
            if (reset) {
                $scope.friendsResult = [];
            }
            params['search'] = input;
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
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.search = {};
        }
        $scope.searching = false;
        $scope.friendsResult = [];
        $scope.hasScroll = false;
        $scope.searchStart = false;

        delete params['search'];
        params['offset'] = 1;
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
        params['offset'] = params['offset'] + 1;
        var word = $scope.search.word;
        if (word && word.length >= 3) {
            $scope.onSearch($scope.search.word, true);
        }
        else {
            load();
        }
    }


});
