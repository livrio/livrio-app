angular.module("starter.controllers")

.controller("friendsCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, $ionicModal, $timeout, FRIEND, settings) {
    $scope.friends = [];

    $scope.loading = true;
    $scope.onRefresh = function() {
        $http.get(settings.URL.FRIEND)
        .success(function(response) {
            if (!response.errors) {
                $scope.friends = [];
                angular.forEach(response.data, function(item) {
                    $scope.friends.push(item);
                });
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.onLibrary = function(item) {
        console.log('onLibrary');
        $rootScope.friend = item;
        window.location = "#/library-friend/" + item.id;
    };


    $scope.onAddFriend = function() {
        console.log('addfriend');
        $ionicModal.fromTemplateUrl("templates/add_friend.html", {
            scope: $scope,
            animation: "slide-in-up"
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

    };

    $scope.onClose = function() {
        $scope.modal.remove();
    };

    var filterTextTimeout;

    $scope.searching = false;
    $scope.friendsResult = [];
    $scope.searchStart = false;

    $scope.onSearch = function(input) {

        if (filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {
            console.log(input);
            $scope.searching = true;
            $scope.searchStart = true;
            FRIEND.search({
                word: input
            }).then(function(data) {
                $scope.searching = false;
                $scope.friendsResult = data;
                console.log(data);
            });
        }, 250); // delay 250 ms
    };



    $scope.onRefresh();


    $rootScope.$on("friend.refresh",function() {
        $scope.onRefresh();
    });

});
